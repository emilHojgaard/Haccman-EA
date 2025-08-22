import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSoundEffect } from "../theLeftoverFiles/SoundEffectContext";
import BaseUI from "./promptPage-components/BaseUI";
import WinScreen from "./promptPage-components/WinScreen";
import GuardrailInfo from "./promptPage-components/smallerComponents/GuardrailInfo";
import LLMInfo from "./promptPage-components/smallerComponents/LLMInfo";
import UserPromptInfo from "./promptPage-components/smallerComponents/UserPromptInfo";
import SystemInfo from "./promptPage-components/smallerComponents/SystemInfo";
import { sendPromptToMemory } from "../apiSupabase";
import { insertPrompt, insertResponse, loadMessages } from "../apiSupabase";
import {
  containsForbiddenPhrases,
  containsForbiddenWords,
} from "./promptPage-components/smallerComponents/ForbiddenChecks";

//supabase:
import { useLocation } from "react-router-dom";

function Prompt(props) {
  //supabase:
  function useSessionId() {
    const { search } = useLocation();
    const qp = new URLSearchParams(search);
    return qp.get("sid");
  }
  const sessionId = useSessionId();

  //Supabase:
  //loading previous messages
  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const rows = await loadMessages(sessionId);
        // Map DB shape -> your UI shape
        const mapped = rows.map((r) => ({
          id: r.role === "user" ? "user" : "adversary",
          message: r.content,
          model: currentModel, // keep your existing model field
        }));
        setPreviousPrompts(mapped);
      } catch (e) {
        console.log("loadMessages failed:", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // State for managing information panels
  const [infoPanels, setInfoPanels] = useState({
    specificOn: false,
    userpromptInfo: false,
    guardarailInfo: false,
    llmInfo: false,
    systemInfo: false,
  });
  //Other states
  const [response, setResponse] = useState("");
  const [previousPrompts, setPreviousPrompts] = useState([]);
  const [winState, setWinState] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [usingMemory, setUsingMemory] = useState(true);
  const [currentModel, setCurrentModel] = useState(0);
  //Other hooks
  const { playSoundEffect } = useSoundEffect();
  const inputRef = useRef(null);
  const navigate = useNavigate();
  //Imported props
  const list_of_challenges = props.listOfChallenges;
  const currentChallenge = props.chosenChallenge;
  //date
  const date = new Date();

  //API CALLS
  //supabase:
  const sendPrompt = async (message, thread, systemPrompt) => {
    try {
      if (!sessionId) throw new Error("Missing session id");

      // 1) Optimistic UI: show user message immediately
      setPreviousPrompts((prev) => [
        ...prev,
        { id: "user", message, model: systemPrompt },
      ]);

      // 2) Insert prompt row in DB
      const promptRow = await insertPrompt(sessionId, message);

      // 3) Get AI reply from your existing backend
      const responseText = await sendPromptToMemory(
        message,
        thread,
        systemPrompt
      );

      // 4) Insert AI response linked to that prompt
      await insertResponse(promptRow.id, responseText);

      // 5) Keep your existing flow: setResponse triggers handleResponse()
      setResponse(responseText);
    } catch (err) {
      console.log("sendPrompt failed:", err);
    }
  };

  //FUNCTIONS/HANDLERS/HELPERS
  //Helper function to handle responses in useEffect
  const handleResponse = async (responseText) => {
    if (!responseText) return;
    // Add AI response to previous prompts
    setPreviousPrompts((prev) => [
      ...prev,
      { id: "adversary", message: responseText, model: currentModel },
    ]);
    // Store the message
    const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    //await storeMessage(responseText, props.name, timeString);
    // Check if the current challenge is completed
    const challenge = list_of_challenges[currentChallenge];
    const isBeaten =
      currentChallenge !== 0
        ? containsForbiddenPhrases(challenge.resolution, responseText)
        : containsForbiddenWords(responseText, challenge.resolution);

    if (isBeaten) {
      console.log("Challenge beaten!");
      props.setCompletedChallenges((prev) => [...prev, currentChallenge]);
      playSoundEffect("win");
      winEffect();
    } else {
      console.log("Challenge not beaten yet.");
    }
  };

  //win-setter for win Effects
  function winEffect() {
    setWinState(true);
  }

  // Helper function to handle key presses
  const handleKeyPress = (event) => {
    // Check if the key pressed is Enter (key code 13)
    if (event.keyCode === 13) {
      // Find the button element by its id and click it
      document.getElementById("sendButton").click();
    }
    if (event.keyCode === 17) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    //tab for clear all
    if (event.keyCode === 9) {
      event.preventDefault();
      document.getElementById("clearAllButton").click();
    }
    //esc for exiting the fight
    if (event.keyCode === 27) {
      event.preventDefault();
      document.getElementById("leaveButton").click();
    }
    //new game key
    if (event.keyCode === 18) {
      event.preventDefault();
      navigate("/");
    }
  };

  //USE-EFFECTS
  // Handle response, check for win conditions
  useEffect(() => {
    handleResponse(response);
  }, [response]);

  //Handles key press events
  useEffect(() => {
    // Add event listener for key press
    document.addEventListener("keydown", handleKeyPress);
    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Shows the win screen after a delay
  useEffect(() => {
    let timer;
    if (winState) {
      timer = setTimeout(() => {
        setShowContent(true);
      }, 3000);
    } else {
      setShowContent(false);
    }
    // Cleanup timer on component unmount or when winState changes
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
          list_of_challenges={list_of_challenges}
          currentChallenge={currentChallenge}
          setInfoPanels={setInfoPanels}
        />
      )}

      <BaseUI
        list_of_challenges={list_of_challenges}
        currentChallenge={currentChallenge}
        previousPrompts={previousPrompts}
        date={date}
        usingMemory={usingMemory}
        sendPrompt={sendPrompt}
        playSoundEffect={playSoundEffect}
        currentModel={currentModel}
        setInfoPanels={setInfoPanels}
        props={props}
      />
    </>
  );
}

export default Prompt;
