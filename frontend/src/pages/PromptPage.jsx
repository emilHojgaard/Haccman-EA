import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AssetInfo from "../AssetInfo";
import { useSoundEffect } from "../SoundEffectContext";
import BaseUI from "./promptPage-components/BaseUI";
import WinScreen from "./promptPage-components/WinScreen";
import GuardrailInfo from "./promptPage-components/smallerComponents/GuardrailInfo";
import LLMInfo from "./promptPage-components/smallerComponents/LLMInfo";
import UserPromptInfo from "./promptPage-components/smallerComponents/UserPromptInfo";
import SystemInfo from "./promptPage-components/smallerComponents/SystemInfo";

function Prompt(props) {
  // Initialize state for the input value
  const [inputValue, setInputValue] = useState("");

  // Event handler to update the input value when it changes
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  //Prompt response state
  const [response, setResponse] = useState("");

  //Prompt history ~ strategy history
  const [previousPrompts, setPreviousPrompts] = useState([]);

  //List of challenges
  const list_of_challenges = props.listOfChallenges;

  //Current challenge
  const currentChallenge = props.chosenChallenge;

  //wonState
  const [winState, setWinState] = useState(false);

  //show win screen when winState is true
  const [showContent, setShowContent] = useState(false);

  //focus mode for information giving
  const [specificOn, setSpecificOn] = useState(false);

  //states for what we are focusing on
  const [userpromptInfo, setUserpromptInfo] = useState(false);

  const [guardarailInfo, setGuardarailInfo] = useState(false);

  const [llmInfo, setLLMInfo] = useState(false);

  const [systemInfo, setSystemInfo] = useState(false);

  const { playSoundEffect } = useSoundEffect();

  // =========================================================== Actually accessing a model: Hugging Face models

  //the currentModel parameter is only for defining which message shows up in which pannel

  //models that work but are dump -> these we could just ask for completion to see if they do a bad word or something
  //gpt2
  //CohereForAI/c4ai-command-r-plus
  //mistralai/Mistral-7B-v0.1

  useEffect(() => {
    previousPrompts;
  }, [previousPrompts]);

  const oldSendPrompt = async (param1, param2, param3) => {
    try {
      setPreviousPrompts([
        ...previousPrompts,
        { id: "user", message: param1, model: param3 },
      ]);

      const encodedString = encodeURIComponent(param1);
      const response = await fetch(
        "https://hacc-man-61ba30704cf0.herokuapp.com/api8989/response1999/" +
          encodedString +
          "/" +
          param2 +
          "/" +
          param3,
        {
          method: "GET",
        }
      );

      const result = await response.text();
      setResponse(result);
    } catch (error) {
      console.log("Error in the sendPrompt " + error);
    }
  };

  const sendPrompt = async (message, thread, systemPromptIndication) => {
    try {
      setPreviousPrompts([
        ...previousPrompts,
        { id: "user", message: message, model: systemPromptIndication },
      ]);

      const response = await fetch(
        "https://haccman2-022f4eadefc4.herokuapp.com/chatmemory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            thread: thread,
            system_prompt: systemPromptIndication,
          }),
        }
      );

      const result = await response.json();
      setResponse(result.response);
    } catch (error) {
      console.log("Error in sendPrompt:", error);
    }
  };

  const storeMessage = async (param1, param2, param3, param4) => {
    try {
      const encodedString = encodeURIComponent(param1);

      const response = await fetch(
        "https://hacc-man-61ba30704cf0.herokuapp.com/api8989/interaction/" +
          param2 +
          "/" +
          encodedString +
          "/" +
          param3 +
          "/" +
          param4,
        {
          method: "POST",
        }
      );

      const result = await response.text();
      console.log("RESULT OF storing " + result);
    } catch (error) {
      console.log("Error in the sendPrompt " + error);
    }
  };

  //WIN STATE AND OTHER THINGS
  //function to check for forbiddenwords in a response, takes two string lists and returns a boolean
  function containsForbiddenWords(response, forbiddenWords) {
    // Convert response to lowercase and split into words
    const words = response.toLowerCase().split(/\s+/);

    // Create a Set of forbidden words for faster lookup
    const forbiddenSet = new Set(
      forbiddenWords.map((word) => word.toLowerCase())
    );

    // Check if any word in the response is in the forbidden words set
    for (const word of words) {
      if (forbiddenSet.has(word)) {
        return true;
      }
    }

    return false;
  }

  function containsForbiddenPhrases(forbiddenPhrases, text) {
    // Convert the text to lowercase for case-insensitive comparison
    const lowerCaseText = text.toLowerCase();

    // Iterate over each forbidden phrase
    for (const phrase of forbiddenPhrases) {
      // Convert the phrase to lowercase for case-insensitive comparison
      const lowerCasePhrase = phrase.toLowerCase();

      // Check if the text contains the forbidden phrase
      if (lowerCaseText.includes(lowerCasePhrase)) {
        return true;
      }
    }

    // If no forbidden phrases are found, return false
    return false;
  }

  useEffect(() => {
    console.log("i can see a response");

    if (response !== null && response !== "") {
      setPreviousPrompts([
        ...previousPrompts,
        { id: "adversary", message: response, model: currentModel },
      ]);
      storeMessage(
        response,
        props.name,
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        "response"
      );
    }

    if (currentChallenge != 0) {
      if (
        containsForbiddenPhrases(
          list_of_challenges[currentChallenge].resolution,
          response
        )
      ) {
        console.log("beaten!");
        const prev = props.completedChallenges;
        props.setCompletedChallenges([...prev, currentChallenge]);
        playSoundEffect("win");
        winEffect();
      } else {
        console.log("it didnt enter the containforbidden words scenario");
      }
    } else {
      console.log("ai anderson");
      if (
        containsForbiddenWords(
          response,
          list_of_challenges[currentChallenge].resolution
        )
      ) {
        console.log("beaten!");
        const prev = props.completedChallenges;
        props.setCompletedChallenges([...prev, currentChallenge]);
        playSoundEffect("win");
        winEffect();
      } else {
        console.log("it didnt enter the containforbidden words scenario");
      }
    }
  }, [response]);

  // useEffect(() => {
  //   const scrollContainer = document.querySelector("#thePartToScroll");
  //   scrollContainer.scrollTop = scrollContainer.scrollHeight;
  // }, [previousPrompts]);

  //handle the click of enter
  const inputRef = useRef(null);

  const navigate = useNavigate();

  //Handles key press events
  useEffect(() => {
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

    // Add event listener for key press
    document.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  //using memory or nah
  const [usingMemory, setUsingMemory] = useState(true);

  //State for current using model - these are used to change between the models, and then the current model is sent in the previous prompt!
  const [currentModel, setCurrentModel] = useState(0);

  //win Effects
  function winEffect() {
    setWinState(true);
  }

  const [initialInfo, setInitialInfo] = useState(true);

  const date = new Date();

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

      {specificOn && guardarailInfo && (
        <GuardrailInfo
          setSpecificOn={setSpecificOn}
          setUserpromptInfo={setUserpromptInfo}
          setGuardarailInfo={setGuardarailInfo}
          setLLMInfo={setLLMInfo}
          setSystemInfo={setSystemInfo}
        />
      )}

      {specificOn && llmInfo && (
        <LLMInfo
          setSpecificOn={setSpecificOn}
          setUserpromptInfo={setUserpromptInfo}
          setGuardarailInfo={setGuardarailInfo}
          setLLMInfo={setLLMInfo}
          setSystemInfo={setSystemInfo}
        />
      )}

      {specificOn && userpromptInfo && (
        <UserPromptInfo
          setSpecificOn={setSpecificOn}
          setUserpromptInfo={setUserpromptInfo}
          setGuardarailInfo={setGuardarailInfo}
          setLLMInfo={setLLMInfo}
          setSystemInfo={setSystemInfo}
        />
      )}

      {specificOn && systemInfo && (
        <SystemInfo
          list_of_challenges={list_of_challenges}
          currentChallenge={currentChallenge}
          setSpecificOn={setSpecificOn}
          setUserpromptInfo={setUserpromptInfo}
          setGuardarailInfo={setGuardarailInfo}
          setLLMInfo={setLLMInfo}
          setSystemInfo={setSystemInfo}
        />
      )}

      <BaseUI
        list_of_challenges={list_of_challenges}
        currentChallenge={currentChallenge}
        previousPrompts={previousPrompts}
        date={date}
        usingMemory={usingMemory}
        sendPrompt={sendPrompt}
        oldSendPrompt={oldSendPrompt}
        storeMessage={storeMessage}
        playSoundEffect={playSoundEffect}
        currentModel={currentModel}
        setSpecificOn={setSpecificOn}
        setGuardarailInfo={setGuardarailInfo}
        setLLMInfo={setLLMInfo}
        setUserpromptInfo={setUserpromptInfo}
        setSystemInfo={setSystemInfo}
        props={props}
      />
    </>
  );
}

export default Prompt;
