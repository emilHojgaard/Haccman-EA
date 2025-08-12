import { useEffect, useState, useRef } from 'react'
import womanGuard from './assets/woman_back.jpg'
import opponent from './assets/ai_oponent.jpeg'
import viteLogo from '/vite.svg'
import OpenAI from "openai";
import axios from 'axios';
import { listFiles, listModels } from "@huggingface/hub";
import { HfInference, textClassification, textToSpeech } from "@huggingface/inference"
import { pipeline } from '@xenova/transformers';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from "react-router-dom"
import Signal from './Signal'
import BoxWithStick from './BoxWithStick';
import AssetInfo from './AssetInfo';
import { useSoundEffect } from './SoundEffectContext';
import opponent2 from './assets/avatar2.png'
import opponent3 from './assets/avatar3.png'
import opponent6 from './assets/avatar6.png'
import opponent41 from './assets/avatar41.png'
import opponent42 from './assets/avatar42.png'
import opponent43 from './assets/avatar43.png'



function Prompt(props) {
    // Initialize state for the input value
    const [inputValue, setInputValue] = useState('');

    // Event handler to update the input value when it changes
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    //Prompt response state
    const [response, setResponse] = useState("")

    //When in hard mode we need a pre final response, which will be the model output, but not necessarily final output
    const [preResponse, setPreResponse] = useState("")

    //Prompt history ~ strategy history
    const [previousPrompts, setPreviousPrompts] = useState([])


    //List of challenges
    const list_of_challenges = props.listOfChallenges

    //Current challenge
    const currentChallenge = props.chosenChallenge

    //Score completed
    const [score, setScore] = useState(0)

    //wonState
    const [winState, setWinState] = useState(false)

    //show win screen when winState is true
    const [showContent, setShowContent] = useState(false);

    //challenge position
    const [challengePosition, setPosition] = useState([{ x: 0, y: 100 }, { x: 0, y: 200 }, { x: 0, y: 300 }]);

    //creativity tracking
    const list_of_solves = [1, 2, 3, 4, 5, 6, 7]

    //focus mode for information giving
    const [specificOn, setSpecificOn] = useState(false)

    //states for what we are focusing on
    const [userpromptInfo, setUserpromptInfo] = useState(false)

    const [guardarailInfo, setGuardarailInfo] = useState(false)

    const [llmInfo, setLLMInfo] = useState(false)

    const [systemInfo, setSystemInfo] = useState(false)

    const { playSoundEffect } = useSoundEffect();



    // =========================================================== Actually accessing a model: Hugging Face models



    //the currentModel parameter is only for defining which message shows up in which pannel

    //models that work but are dump -> these we could just ask for completion to see if they do a bad word or something
    //gpt2
    //CohereForAI/c4ai-command-r-plus
    //mistralai/Mistral-7B-v0.1

    async function query(prompt, endpoint, currentModel) {

        setPreviousPrompts([...previousPrompts, { id: "user", message: prompt, model: currentModel }])
        setPreviousPrompts([...previousPrompts, { id: "adversary", message: "...", model: currentModel }])

        //previousPrompts.push({ id: "user", message: prompt, model: currentModel })

        // 'google/codegemma-7b-it' was to big
        // llama was giving 503
        // mistral 8x22b was also too big

        //llama 

        const inference = new HfInference(API_TOKEN);










        //create the model based on the dedicated point


        //const response = await inference.textGeneration({ inputs: prompt, model: endpoint })


        //setResponse(response.generated_text);
        //setPreviousPrompts([...previousPrompts, { id: "adversary", message: response.generated_text, model: currentModel }])


    }




    useEffect(() => { previousPrompts }, [previousPrompts])



    const oldSendPrompt = async (param1, param2, param3) => {
        try {
            setPreviousPrompts([...previousPrompts, { id: "user", message: param1, model: param3 }])

            const encodedString = encodeURIComponent(param1);
            const response = await fetch("https://hacc-man-61ba30704cf0.herokuapp.com/api8989/response1999/" + encodedString + '/' + param2 + '/' + param3,
                {
                    method: 'GET'
                }
            )

            const result = await response.text()
            setResponse(result)





        } catch (error) {
            console.log("Error in the sendPrompt " + error)
        }

    }

    const sendPrompt = async (message, thread, systemPromptIndication) => {
        try {
            setPreviousPrompts([...previousPrompts, { id: "user", message: message, model: systemPromptIndication }])

            const response = await fetch("https://haccman2-022f4eadefc4.herokuapp.com/chatmemory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message,
                    thread: thread,
                    system_prompt: systemPromptIndication
                })
            })

            const result = await response.json()
            setResponse(result.response)

        } catch (error) {
            console.log("Error in sendPrompt:", error)
        }
    }


    const storeMessage = async (param1, param2, param3, param4) => {
        try {

            const encodedString = encodeURIComponent(param1);

            const response = await fetch("https://hacc-man-61ba30704cf0.herokuapp.com/api8989/interaction/" + param2 + '/' + encodedString + '/' + param3 + '/' + param4,
                {
                    method: 'POST'
                }
            )

            const result = await response.text()
            console.log("RESULT OF storing " + result)
        } catch (error) {
            console.log("Error in the sendPrompt " + error)
        }

    }




    async function secondGuardRail(possibleResponse) {
        try {
            const SecondBooleanCheck = await openai.chat.completions.create({
                messages: [{ role: "user", content: possibleResponse }, { role: "system", content: "Respond with 'true' or 'false', does this message " + list_of_challenges[currentChallenge].cant }],
                model: list_of_models[currentModel].endpoint
            });

            return (SecondBooleanCheck.choices[0].message.content)

        } catch (error) {
            console.log("error in the secondGuardRail", error)
        }
    }

    //For the hard challenge, i need to wait for the preResponse to be set to make the other LLM call!
    /* useEffect(() => {
        const LastUserMessage = previousPrompts.filter(el => (el.id === "user")).

        console.log(LastUserMessage, "this is the last user message!")
    }, [previousPrompts]) */


    //WIN STATE AND OTHER THINGS
    //function to check for forbiddenwords in a response, takes two string lists and returns a boolean 
    function containsForbiddenWords(response, forbiddenWords) {
        // Convert response to lowercase and split into words
        const words = response.toLowerCase().split(/\s+/);

        // Create a Set of forbidden words for faster lookup
        const forbiddenSet = new Set(forbiddenWords.map(word => word.toLowerCase()));

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
        console.log("i can see a response")

        if (response !== null && response !== "") {
            setPreviousPrompts([...previousPrompts, { id: "adversary", message: response, model: currentModel }])
            storeMessage(response, props.name, date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(), "response")
        }

        //list_of_challenges[currentChallenge].resolution
        //const list_of_current_resolutions = []
        //currentChallenge.forEach((el) => (list_of_current_resolutions.push(list_of_challenges[el].resolution)))

        if (currentChallenge != 0) {
            if (containsForbiddenPhrases(list_of_challenges[currentChallenge].resolution, response)) {
                console.log("beaten!")
                const prev = props.completedChallenges
                props.setCompletedChallenges([...prev, currentChallenge])
                playSoundEffect('win')
                winEffect()

            } else {
                console.log("it didnt enter the containforbidden words scenario")
            }

        } else {
            console.log("ai anderson")
            if (containsForbiddenWords(response, list_of_challenges[currentChallenge].resolution)) {
                console.log("beaten!")
                const prev = props.completedChallenges
                props.setCompletedChallenges([...prev, currentChallenge])
                playSoundEffect('win')
                winEffect()

            } else {
                console.log("it didnt enter the containforbidden words scenario")
            }

        }







    }, [response])


    useEffect(() => {
        const scrollContainer = document.querySelector('#thePartToScroll');
        scrollContainer.scrollTop = scrollContainer.scrollHeight


    }, [previousPrompts])

    //handle the click of enter
    const inputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (event) => {
            // Check if the key pressed is Enter (key code 13)
            if (event.keyCode === 13) {
                // Find the button element by its id and click it
                document.getElementById('sendButton').click();
            }

            if (event.keyCode === 17) {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }

            //tab for clear all
            if (event.keyCode === 9) {
                event.preventDefault();
                document.getElementById("clearAllButton").click()
            }

            //esc for exiting the fight
            if (event.keyCode === 27) {
                event.preventDefault();
                document.getElementById("leaveButton").click()
            }

            //new game key
            if (event.keyCode === 18) {
                event.preventDefault();
                navigate("/")
            }
        };

        // Add event listener for key press
        document.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [])




    //Defining the model usage part

    //Trying to get all available models
    //Using a async function similar to getting one response but to get all (or like 5) of the endpoints available
    /* async function getModels() {
        

        for await (const model of listModels({ credentials: credentials, limit: 15, search: { task: 'text-generation' } })) {
            console.log("My model:", model);
        }

    }

    useEffect(() => {
        console.log("calling 5 models")

        getModels()

    }, []) */

    //using memory or nah
    const [usingMemory, setUsingMemory] = useState(true)

    //List of available models
    const list_of_models = [{ name: "Chat GPT-3.5 Turbo", endpoint: "gpt-3.5-turbo", type: "openai" }, { name: "Chat GPT-4", endpoint: "gpt-4", type: "openai" },
    { name: "Google Gemma 1.1 7b", endpoint: "", type: "other" }]

    //so now when you send a prompt, you need to put it into a specific list, one that follows the model where the prompt came from

    //so that when im displaying the chats, im dislaying for the current selected model

    //State for current using model - these are used to change between the models, and then the current model is sent in the previous prompt!
    const [currentModel, setCurrentModel] = useState(0)


    //win Effects
    function winEffect() {
        setWinState(true)
    }

    const [initialInfo, setInitialInfo] = useState(true)

    const [afterFilter, setAfterFilter] = useState(false)

    const date = new Date()


    //the scroll effect
    useEffect(() => {

        document.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowUp') { // Check if the Down arrow key is pressed
                event.preventDefault(); // Prevent the default action (optional)
                console.log("okat")
                const scrollContainer = document.getElementById('thePartToScroll');
                const scrollStep = -70; // Adjust the scroll step as per your requirement

                // Scroll the container down by the defined scroll step
                scrollContainer.scrollBy({
                    top: scrollStep,
                    behavior: 'smooth' // Use smooth scrolling
                });
            }

            if (event.key === 'ArrowDown') { // Check if the Down arrow key is pressed
                event.preventDefault(); // Prevent the default action (optional)
                console.log("okat")
                const scrollContainer = document.getElementById('thePartToScroll');
                const scrollStep = 70; // Adjust the scroll step as per your requirement

                // Scroll the container down by the defined scroll step
                scrollContainer.scrollBy({
                    top: scrollStep,
                    behavior: 'smooth' // Use smooth scrolling
                });
            }
        });



    }, [])

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
            {showContent &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div className='beaten' >
                        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                            <div style={{ display: "flex", justifyContent: "end", border: "2px solid #FFFADE", background: "#000000" }}>
                                <button onClick={() => {
                                    setInitialInfo(false)

                                }}>x</button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", border: "2px solid #FFFADE", background: "#000000", height: "400px" }}>
                                <div style={{
                                    display: "flex", flexDirection: "column", background: "#000000", gap: "10px", overflowY: "scroll", letterSpacing: "1px",
                                    lineHeight: "30px", alignItems: "center"
                                }}>
                                    <img src="/Winner trophy 1.png" alt="Custom Image" class="win"></img>
                                    <div style={{ padding: "10px", fontFamily: "ARCADE_I", color: "#FFFADE", textShadow: '4px 4px 0px #A9345C', fontSize: 40 }}>
                                        {">>>>JAILBROKEN<<<<"}
                                    </div>

                                    <div style={{ padding: "10px", color: "#ffffff" }}>
                                        {"You broke through the LLM guardrails!"}
                                    </div>



                                </div>
                            </div>
                            <button onClick={() => {
                                setWinState(false)
                                setShowContent(false);
                            }}> Press Esc to hacc on! </button>
                        </div>



                    </div>
                    <div className='beaten-back' >

                    </div>
                </div>
            }



            {specificOn && guardarailInfo &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "left", justifyContent: "center" }}>
                    <div className='beaten' >
                        <AssetInfo setSpecificOn={setSpecificOn} setUserpromptInfo={setUserpromptInfo} setGuardarailInfo={setGuardarailInfo}
                            setLLMInfo={setLLMInfo} mainText={"guardrail"}></AssetInfo>
                    </div>
                    <div className='beaten-back' >
                    </div>
                </div>
            }

            {specificOn && llmInfo &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div className='beaten' >
                        <AssetInfo setSpecificOn={setSpecificOn} setUserpromptInfo={setUserpromptInfo} setGuardarailInfo={setGuardarailInfo}
                            setLLMInfo={setLLMInfo} mainText={"llm"}></AssetInfo>
                    </div>
                    <div className='beaten-back' >
                    </div>
                </div>
            }

            {specificOn && userpromptInfo &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div className='beaten' >
                        <AssetInfo setSpecificOn={setSpecificOn} setUserpromptInfo={setUserpromptInfo} setGuardarailInfo={setGuardarailInfo}
                            setLLMInfo={setLLMInfo} mainText={"userprompt"}></AssetInfo>
                    </div>
                    <div className='beaten-back' >
                    </div>
                </div>
            }

            {specificOn && systemInfo &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div className='beaten'>
                        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                            <div style={{ display: "flex", justifyContent: "end", border: "2px solid #000000", background: "#ffffff" }}>
                                <button onClick={() => {
                                    setSpecificOn(false)
                                    setGuardarailInfo(false)
                                    setLLMInfo(false)
                                    setUserpromptInfo(false)
                                    setSystemInfo(false)
                                }}> x x x</button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", border: "2px solid #000000", background: "#ffffff" }}>
                                <div style={{ display: "flex", flexDirection: "column", background: "#ffffff", gap: "6vh", overflowY: "scroll", padding: "10px" }}>



                                    <div style={{ paddingLeft: "10px" }}>{list_of_challenges[currentChallenge].is}</div>

                                    <div> {"> This LLM has the following system message: "}</div>
                                    <div> {'"' + list_of_challenges[currentChallenge].system + '"'}</div>
                                    <div> {list_of_challenges[currentChallenge].difficulty === "easy" ?
                                        "> There are NO active guardrails" : list_of_challenges[currentChallenge].difficulty === "medium" ?
                                            "> There is ONE active guardrail" : "> There are TWO active guardrails"
                                    }</div>

                                </div>
                            </div>
                            <button onClick={() => {
                                setSpecificOn(false)
                                setGuardarailInfo(false)
                                setLLMInfo(false)
                                setUserpromptInfo(false)
                                setSystemInfo(false)
                            }}> OK </button>
                        </div>

                    </div>
                    <div className='beaten-back' >

                    </div>

                </div>


            }

            <div style={{ zIndex: 1 }}>
                <div className='background'>


                    <div style={{ marginTop: "40px", marginLeft: "40px", display: "flex", flexDirection: "row", gap: "50px", justifyContent: "space-around" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5vh", width: "60%" }} >


                            <div id="llm-box" style={{ display: "flex", justifyContent: "flex-start", flexDirection: "column" }} >
                                <div style={{ display: "flex", border: "2px solid #000000", background: "#000000", color: "#FFFADE", padding: "10px", fontSize: "35px", fontFamily: "ARCADE_I", textShadow: '4px 4px 0px #A9345C' }}>{">>>JAILBREAK CHALLENGE: "}</div>
                                <div style={{ color: "#FFFADE" }}>{list_of_challenges[currentChallenge].description.toUpperCase()}</div>


                            </div>

                            <div id="boxresponseandprompt" style={{ display: "flex", flexDirection: "column", gap: "6vh" }}>
                                <div id="id-6" className='box-responses'>
                                    <div style={{ display: "flex", border: "2px solid #000000", background: "#ffffff", padding: "5px" }}>
                                        Message tracker</div>
                                    <div id='thePartToScroll' style={{ overflowY: "scroll" }}>
                                        {previousPrompts.map((el, index) => (
                                            el.id === "user" ? (
                                                <div style={{ display: "flex", justifyContent: 'flex-start', marginLeft: "auto", flexDirection: "column", color: "#A9345C", padding: "5px", textAlign: "left" }}>
                                                    {"Your message - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()}
                                                    <div key={index} className="vaporwave-miami-box-user">
                                                        {el.message}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", color: "blue", padding: "5px", textAlign: "left" }}>
                                                    {"Active LLM - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()}
                                                    <div key={index} className="vaporwave-miami-box-ai">{el.message}</div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                                    {/* <Signal></Signal>
                        <Signal></Signal> */}


                                    <input id="textInputField" className='the-vaporwave-input' value={inputValue} onChange={handleChange}
                                        ref={inputRef}
                                        placeholder='Press CTRL to enter a message'  >
                                    </input>


                                    {usingMemory && <div style={{ display: "flex", border: "2px solid #ffffff", padding: "5px", width: "10%" }}>
                                        <button id="sendButton" className="the-vaporwave-button2" onClick={() => {
                                            console.log(currentChallenge)
                                            playSoundEffect('select'),
                                                sendPrompt(inputValue, props.name + props.age, currentChallenge)
                                            storeMessage(inputValue, props.name, date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(), "message")
                                            setInputValue("")
                                        }
                                        }>
                                            SEND
                                        </button>
                                    </div>}

                                    {!usingMemory && <div style={{ display: "flex", border: "2px solid #ffffff", padding: "5px", width: "10%" }}>
                                        <button id="sendButton" className="the-vaporwave-button2" onClick={() => {
                                            console.log(currentChallenge)
                                            playSoundEffect('select'),
                                                oldSendPrompt(inputValue, currentChallenge, currentModel)
                                            storeMessage(inputValue, props.name, date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(), "message")
                                            setInputValue("")
                                        }
                                        }>
                                            SEND (no memory)
                                        </button>
                                    </div>}


                                    <div style={{ display: "flex", border: "2px solid #ffffff", padding: "5px", width: "10%" }}>
                                        <button id='clearAllButton' className="the-vaporwave-button2" onClick={() => {
                                            playSoundEffect('select'); // Play  sound effect
                                            setPreviousPrompts([]);
                                        }}
                                        >
                                            Clear (Tab)
                                        </button>
                                    </div>



                                </div>
                                {/* <div style={{ marginRight: "300px", display: "flex", flexDirection: "row", gap: "20px" }}>
                                    <Link to="/play">
                                        <button>Quit fight</button>
                                    </Link>

                                </div> */}



                            </div>




                            {/* <Signal direction="not"></Signal>
                        <Signal id="upper-left" direction="right"></Signal> */}




                        </div>




                        <div style={{ display: "flex", flexDirection: "column", width: "30%", alignItems: "center", justifyContent: "space-between", height: "99%" }}>

                            <div style={{ display: "flex", flexDirection: "column" }} >
                                <div style={{
                                    display: "flex", flexDirection: "column", border: "2px solid #fffffff", background: "#000000", width: "400px", padding: "10px",
                                    color: "#ffffff", gap: "2vh"
                                }}>
                                    <div style={{ display: "flex", padding: "2px", fontSize: "20px", color: "#FFFADE" }}> PLAYING:</div>
                                    <div style={{ display: "flex", justifyContent: "center", padding: "10px", fontSize: "20px", color: "#000000", background: "#F5EB1D" }}>{list_of_challenges[currentChallenge].is}</div>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <div >
                                            {list_of_challenges[currentChallenge].number === 0 ? <img src={opponent43} width={"140px"} ></img> :
                                                list_of_challenges[currentChallenge].number === 1 ? <img src={opponent41} width={"140px"}></img> :
                                                    list_of_challenges[currentChallenge].number === 2 ? <img src={opponent42} width={"140px"}></img> :
                                                        list_of_challenges[currentChallenge].number === 3 ? <img src={opponent2} width={"140px"}></img> :
                                                            list_of_challenges[currentChallenge].number === 4 ? <img src={opponent3} width={"140px"}></img> :
                                                                <img src={opponent6} width={"140px"}></img>
                                            }
                                        </div>




                                        <div style={{ display: "flex", padding: "2px", fontSize: "15px", color: "#FFFADE" }}>{list_of_challenges[currentChallenge].long_system_description}</div>

                                    </div>


                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }} >

                                <div style={{ display: "flex", border: "2px solidrgb(0, 0, 0)", padding: "5px" }}>
                                    <button id="sendButton" className="the-vaporwave-button2" onClick={() => setUsingMemory(!usingMemory)}>
                                        {usingMemory && "Memory is activated"}
                                        {!usingMemory && "Memory is DESACTIVATED"}
                                    </button>
                                </div>

                                <div style={{ display: "flex", border: "2px solidrgb(0, 0, 0)", padding: "5px", color: "white" }}>
                                    {usingMemory && "The models will remember previous messages inside each conversation."}
                                    {!usingMemory && "The models will NOT remember previous messages inside each conversation."}

                                </div>




                            </div>

                            <div style={{ display: "flex", border: "2px solid #ffffff", padding: "5px" }}>

                                <Link to="/play">
                                    <button id="leaveButton"
                                        onClick={() => {
                                            playSoundEffect('select'); // Play sound effect
                                        }}>
                                        Leave fight (Esc)</button>
                                </Link>
                            </div>


                        </div>














                        {/* <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                            <button id="sendButton" className="vaporwave-button" onClick={() => {
                                sendPrompt(inputValue, currentChallenge, currentModel)
                                setInputValue("")
                            }
                            }>
                                Send prompt
                            </button>




                            
                        </div> */}
                    </div>

                </div>

            </div >



        </>

    )
}

export default Prompt
