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
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Win state
  const [winConditions, setWinConditions] = useState({phrases: false, words: false, cpr: false, name: false});
  const [winState, setWinState] = useState(false);

  // hooks
  const { playSoundEffect } = useSoundEffect();
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const requestIdRef = useRef(0);

  // props
  const { botList, selectedBot } = props;

  // Set initial selected task based on selected bot
  useEffect(() => {
    const bot = botList?.find((b) => b.number === selectedBot);
    setSelectedTask(bot.taskList[0]);
  }, [botList, selectedBot]);

  const date = new Date();

  // ---- Sending a message ----
  const sendPrompt = async (message) => {
    let myRequestId;
    try {
      if (!sessionId) throw new Error("Missing session id");

      // Compute the system prompt + constrain from the selected challenge
      const systemPrompt = selectedTask.systemPrompt;
      const constrain = selectedTask.constrain;

      // updating previous prompts with user message
      const currentUserMessage= { id: "user", message, date: new Date(Date.now()).toLocaleString() };
      setPreviousPrompts((prev) => [...prev, currentUserMessage]);
      setIsLoading(true);
      myRequestId = ++requestIdRef.current; 

      // Insert prompt row in DB
      const promptRow = await insertPrompt(sessionId, message);
      
      // Call Edge Function (OpenAI) to get reply
      const { mode, aiResponsetext, sources, document, sourceRefs } =
        await sendPromptToAI(
          message,
          systemPrompt,
          constrain,
          guardrail,
          previousPrompts
        );
      console.log(`AI Response Mode: ${mode.toUpperCase()}\n`);
      console.table(sources);
      console.log("sources:", sources);
      console.log("aiResponsetext:", aiResponsetext);
      console.log("sourceRefs:", sourceRefs);

      // Insert AI response linked to that prompt
      await insertResponse(promptRow.id, aiResponsetext, sources);
      console.log("Inserted AI response into DB");

      // Check if the request ID matches then handle response in UI 
      if (requestIdRef.current !== myRequestId) return;
      handleResponse(aiResponsetext, sourceRefs);

    } catch (err) {
      console.error("Error message:", err?.message ?? err);
    } 
  finally {
      // Clear spinner even on error/empty result
      if (requestIdRef.current === myRequestId) setIsLoading(false);
  }
  };

  // Handle AI response (update UI + win check)
  const handleResponse = (responseText, sourceRefs) => {
    if (!responseText) return;

    // Add AI response to previous prompts
    setPreviousPrompts((prev) => [
      ...prev,
      {
        id: "assistant",
        message: responseText,
        date: new Date(Date.now()).toLocaleString(),
        sourceRefs: sourceRefs,
      },
    ]);
    setIsLoading(false);

  // ------------ Win check ------------------
  //saving states in local variables to avoid stale state issues
  const phrasesHit = containsForbiddenPhrases(selectedTask.resolution.phrases, responseText);
  const wordsHit   = containsForbiddenWords(responseText, selectedTask.resolution.listOfWords);
  const cprHit     = containsForbiddenWords(responseText, selectedTask.resolution.cpr);
  const nameHit    = containsForbiddenWords(responseText, selectedTask.resolution.name);

  // build next state in memory to remember earlier partial hits
  const nextWin = {
    ...winConditions,           
    phrases: phrasesHit || winConditions.phrases,
    words:   wordsHit   || winConditions.words,
    cpr:     cprHit     || winConditions.cpr,
    name:    nameHit    || winConditions.name,
  };
  setWinConditions(nextWin);
  console.log("Win conditions:", nextWin);

  // check if all conditions are met
  const beaten = (nextWin.phrases || nextWin.words) && (nextWin.cpr || nextWin.name);

  if (beaten){
      console.log("Challenge beaten!");
      props.setCompletedChallenges((prev) => [...prev, selectedBot]);
      playSoundEffect("win");
      setWinState(true);
    } else {
      console.log("Challenge not beaten yet.");
    }
  };

 

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
        isLoading={isLoading}
      />
    </>
  );
}

export default Prompt;
