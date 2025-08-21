import Prompt from "./pages/PromptPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SoundEffectProvider } from "./theLeftoverFiles/SoundEffectContext";
import Initial from "./pages/InitialPage";
import Choose from "./pages/ChoosePage";
import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import MusicPlayer from "./theLeftoverFiles/MusicPlayer";
import DataPage from "./pages/DataPage";
import { ListOfChallenges } from "./theLeftoverFiles/ListOfChallenges";
import { pingBackend } from "./api";

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  //A.I Anderson
  const listOfChallenges = ListOfChallenges;

  //user stuff
  const [name, setName] = useState("horse_with_no_name");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [familiarity, setFamiliarity] = useState("");

  useEffect(() => {
    console.log("username", name);
  }, [name]);

  //TEST LOCAL BACKEND CONNECTION:
  // useEffect(() => {
  //   async function testBackend() {
  //     const data = await pingBackend();
  //     if (data) console.log(data.message);
  //   }
  //   testBackend();
  // }, []);

  return (
    <SoundEffectProvider>
      <BrowserRouter>
        <MusicPlayer />
        <Routes>
          <Route
            path="/"
            element={
              <Initial
                setName={setName}
                setAge={setAge}
                setGender={setGender}
                setFamiliarity={setFamiliarity}
              />
            }
          ></Route>
          <Route path="/data" element={<DataPage />}></Route>
          <Route
            path="/play"
            element={
              <Choose
                chosenChallenge={selectedChallenge}
                setChosenChallenge={setSelectedChallenge}
                listOfChallenges={listOfChallenges}
                completedChallenges={completedChallenges}
              />
            }
          ></Route>
          <Route
            path="/play2"
            element={
              <Prompt
                chosenChallenge={selectedChallenge}
                listOfChallenges={listOfChallenges}
                name={name}
                age={age}
                gender={gender}
                familiarity={familiarity}
                setCompletedChallenges={setCompletedChallenges}
                completedChallenges={completedChallenges}
              />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </SoundEffectProvider>
  );
}

export default App;
