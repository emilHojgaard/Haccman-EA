import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSoundEffect } from "../theLeftoverFiles/SoundEffectContext";
import BaseUI from "./promptPage-components/BaseUI";
import WinScreen from "./promptPage-components/WinScreen";
import SystemInfo from "./promptPage-components/smallerComponents/SystemInfo";
import SystemPromptOverlay from "./promptPage-components/smallerComponents/SystemPromptOverlay";
import {
  sendPromptToAI,
  insertPrompt,
  insertResponse,
  loadMessages,
} from "../apiSupabase";
import {
  containsForbiddenPhrases,
  containsForbiddenWords,
} from "./promptPage-components/smallerComponents/ForbiddenChecks";

function useSessionId() {
  const { search } = useLocation();
  const qp = new URLSearchParams(search);
  return qp.get("sid");
}

function Prompt(props) {
  const sessionId = useSessionId();

  // Button states
  const [ShowSystemprompt, setShowSystemprompt] = useState(false);
  const [guardrail, setGuardrail] = useState("");
  const [showInformation, setShowInformation] = useState(false);

  // Chat state
  const [response, setResponse] = useState("");
  const [sourceTitles, setSourceTitles] = useState([]);
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [winState, setWinState] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // hooks
  const { playSoundEffect } = useSoundEffect();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // props
  const { botList, selectedBot } = props;

  // Set initial selected task based on selected bot
  useEffect(() => {
    const bot = botList?.find((b) => b.number === selectedBot);
    setSelectedTask(bot.taskList[0]);
  }, [botList, selectedBot]);

  const date = new Date();

  // Load previous messages for this session. NOT WORKING CURRENTLY
  // useEffect(() => {
  //   if (!sessionId) return;
  //   (async () => {
  //     try {
  //       const rows = await loadMessages(sessionId);
  //       // Expect rows like: [{ role: 'user'|'assistant', content: string, created_at: ... }, ...]
  //       const mapped = rows.map((r) => ({
  //         id: r.role === "user" ? "user" : "adversary",
  //         message: r.content,
  //       }));
  //       setPreviousPrompts(mapped);
  //     } catch (e) {
  //       console.log("loadMessages failed:", e);
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sessionId]);

  // ---- Sending a message ----
  const sendPrompt = async (message) => {
    try {
      if (!sessionId) throw new Error("Missing session id");

      // Compute the system prompt from the selected challenge
      const systemPrompt = selectedTask.systemPrompt;

      // 1) Optimistic UI: show user message immediately
      setPreviousPrompts((prev) => [
        ...prev,
        { id: "user", message, date: new Date(Date.now()).toLocaleString() },
      ]);
      setIsLoading(true);

      // 2) Insert prompt row in DB
      const promptRow = await insertPrompt(sessionId, message);

      // 3) Call Edge Function (OpenAI) to get reply
      const { mode, aiResponsetext, sources, document, titles } =
        await sendPromptToAI(message, systemPrompt, guardrail);
      console.log(`AI Response Mode: ${mode.toUpperCase()}\n`);
      console.table(sources);

      console.log("AI response mode:", mode);
      console.log("AI response text:", aiResponsetext);
      console.log("AI response sources:", sources);
      console.log("AI response titles:", titles);
      console.log(
        "doc_type:",
        sources.map((s) => s.doc_type)
      );

      // setting source titles for refferencing
      setSourceTitles(titles || []);
      console.log("sourceTitles:", sourceTitles);
      // 4) Insert AI response linked to that prompt
      await insertResponse(promptRow.id, aiResponsetext, sources);
      console.log("Inserted AI response into DB");

      // // 5) Trigger post-processing (win check, etc.)
      // setSourceTitles(titles);
      setResponse(aiResponsetext);
    } catch (err) {
      console.error("Error message:", err?.message ?? err);
    }
  };

  // Handle AI response (update UI + win check)
  const handleResponse = async (responseText) => {
    if (!responseText) return;

    // Add AI response to previous prompts
    setPreviousPrompts((prev) => [
      ...prev,
      {
        id: "adversary",
        message: responseText,
        date: new Date(Date.now()).toLocaleString(),
      },
    ]);
    setIsLoading(false);

    // Win check

    const isBeaten =
      selectedBot !== 0
        ? containsForbiddenPhrases(selectedTask.resolution, responseText)
        : containsForbiddenWords(responseText, selectedTask.resolution);

    if (isBeaten) {
      console.log("Challenge beaten!");
      props.setCompletedChallenges((prev) => [...prev, selectedBot]);
      playSoundEffect("win");
      setWinState(true);
    } else {
      console.log("Challenge not beaten yet.");
    }
  };

  // Effect: run handleResponse when response changes
  useEffect(() => {
    handleResponse(response);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  // Keyboard shortcuts (enter, tab, esc, etc.)
  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      document.getElementById("sendButton")?.click();
    }
    if (event.keyCode === 17) {
      inputRef.current?.focus();
    }
    if (event.keyCode === 9) {
      event.preventDefault();
      document.getElementById("clearAllButton")?.click();
    }
    if (event.keyCode === 27) {
      event.preventDefault();
      document.getElementById("leaveButton")?.click();
    }
    if (event.keyCode === 18) {
      event.preventDefault();
      navigate("/");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Win screen delay
  useEffect(() => {
    let timer;
    if (winState) {
      timer = setTimeout(() => setShowContent(true), 3000);
    } else {
      setShowContent(false);
    }
    return () => clearTimeout(timer);
  }, [winState]);

  return (
    <>
      {showContent && (
        <WinScreen setWinState={setWinState} setShowContent={setShowContent} />
      )}

      {ShowSystemprompt && (
        <SystemPromptOverlay
          botList={botList}
          selectedBot={selectedBot}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          setShowSystemprompt={setShowSystemprompt}
        />
      )}

      {showInformation && (
        <SystemInfo
          botList={botList}
          selectedBot={selectedBot}
          setShowInformation={setShowInformation}
          selectedTask={selectedTask}
        />
      )}

      <BaseUI
        botList={botList}
        selectedBot={selectedBot}
        setPreviousPrompts={setPreviousPrompts}
        previousPrompts={previousPrompts}
        date={date}
        sendPrompt={sendPrompt}
        playSoundEffect={playSoundEffect}
        setShowInformation={setShowInformation}
        setGuardrail={setGuardrail}
        guardrail={guardrail}
        setShowSystemprompt={setShowSystemprompt}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        sourceTitles={sourceTitles}
        isLoading={isLoading}
      />
    </>
  );
}

export default Prompt;
