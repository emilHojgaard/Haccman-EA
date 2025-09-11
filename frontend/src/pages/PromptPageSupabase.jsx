import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSoundEffect } from "../theLeftoverFiles/SoundEffectContext";
import BaseUI from "./promptPage-components/BaseUI";
import WinScreen from "./promptPage-components/WinScreen";
import GuardrailInfo from "./promptPage-components/smallerComponents/GuardrailInfo";
import LLMInfo from "./promptPage-components/smallerComponents/LLMInfo";
import UserPromptInfo from "./promptPage-components/smallerComponents/UserPromptInfo";
import SystemInfo from "./promptPage-components/smallerComponents/SystemInfo";
import {
  sendPromptToMemory,
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

  // Info panels
  const [infoPanels, setInfoPanels] = useState({
    specificOn: false,
    userpromptInfo: false,
    guardarailInfo: false,
    llmInfo: false,
    systemInfo: false,
  });

  // Chat state
  const [response, setResponse] = useState("");
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [winState, setWinState] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [usingMemory, setUsingMemory] = useState(true); // if you still want the label toggle

  // hooks
  const { playSoundEffect } = useSoundEffect();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // props
  const botList = props.botList;
  const selectedBot = props.selectedBot;

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
      const bot = botList.find((b) => b.number === selectedBot);
      const systemPrompt = bot?.system ?? "";

      // 1) Optimistic UI: show user message immediately
      setPreviousPrompts((prev) => [...prev, { id: "user", message }]);

      // 2) Insert prompt row in DB
      const promptRow = await insertPrompt(sessionId, message);

      // 3) Call Edge Function (OpenAI) to get reply
      const responseText = await sendPromptToMemory(message, systemPrompt);

      // 4) Insert AI response linked to that prompt
      await insertResponse(promptRow.id, responseText);

      // 5) Trigger post-processing (win check, etc.)
      setResponse(responseText);
    } catch (err) {
      console.log("sendPrompt failed:", err);
    }
  };

  // Handle AI response (update UI + win check)
  const handleResponse = async (responseText) => {
    const bot = botList.find((b) => b.number === selectedBot);
    if (!responseText) return;

    // Add AI response to previous prompts
    setPreviousPrompts((prev) => [
      ...prev,
      { id: "adversary", message: responseText },
    ]);

    // Win check

    const isBeaten =
      selectedBot !== 0
        ? containsForbiddenPhrases(bot.resolution, responseText)
        : containsForbiddenWords(responseText, bot.resolution);

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

      {infoPanels.guardarailInfo && (
        <GuardrailInfo setInfoPanels={setInfoPanels} />
      )}

      {infoPanels.llmInfo && <LLMInfo setInfoPanels={setInfoPanels} />}

      {infoPanels.userpromptInfo && (
        <UserPromptInfo setInfoPanels={setInfoPanels} />
      )}

      {infoPanels.systemInfo && (
        <SystemInfo
          botList={botList}
          selectedBot={selectedBot}
          setInfoPanels={setInfoPanels}
        />
      )}

      <BaseUI
        botList={botList}
        selectedBot={selectedBot}
        previousPrompts={previousPrompts}
        date={date}
        usingMemory={usingMemory}
        sendPrompt={sendPrompt}
        playSoundEffect={playSoundEffect}
        setInfoPanels={setInfoPanels}
      />
    </>
  );
}

export default Prompt;
