import Prompt from "./pages/PromptPageSupabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SoundEffectProvider } from "./theLeftoverFiles/SoundEffectContext";
import Initial from "./pages/InitialPage";
import Choose from "./pages/ChooseOnePage";
import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import MusicPlayer from "./theLeftoverFiles/MusicPlayer";
import DataPage from "./pages/DataPage";
import { ListOfChallenges } from "./theLeftoverFiles/ListOfChallenges";
import { MedicalBot } from "./theLeftoverFiles/MedicalBot.jsx";
import {
  supabase,
  ensureAnonymousSession,
} from "./theLeftoverFiles/SupabaseClient.jsx";

function App() {
  const [selectedBot, setSelectedBot] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  //A.I Anderson
  const listOfChallenges = ListOfChallenges;

  //user stuff
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [familiarity, setFamiliarity] = useState("");

  useEffect(() => {
    ensureAnonymousSession().catch(console.error);
  }, []);

  return (
    <SoundEffectProvider>
      <BrowserRouter>
        <MusicPlayer />
        <Routes>
          <Route path="/" element={<Initial />}></Route>
          <Route path="/data" element={<DataPage />}></Route>
          <Route
            path="/play"
            element={
              <Choose
                selectedBot={selectedBot}
                setSelectedBot={setSelectedBot}
                listOfChallenges={MedicalBot}
                completedChallenges={completedChallenges}
              />
            }
          ></Route>
          <Route
            path="/play2"
            element={
              <Prompt
                selectedBot={selectedBot}
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
