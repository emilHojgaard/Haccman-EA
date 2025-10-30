import Prompt from "./pages/PromptPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SoundEffectProvider } from "./theLeftoverFiles/SoundEffectContext";
import Initial from "./pages/InitialPage";
import Choose from "./pages/ChooseOnePage";
import { useEffect, useState } from "react";
import "react-h5-audio-player/lib/styles.css";
import MusicPlayer from "./theLeftoverFiles/MusicPlayer";
import DataPage from "./pages/DataPage";
import { ListOfChallenges } from "./theLeftoverFiles/ListOfChallenges";
import { botList } from "./theLeftoverFiles/botList.jsx";
import {
  supabase,
  ensureAnonymousSession,
} from "./theLeftoverFiles/SupabaseClient.jsx";

function App() {
  const [selectedBot, setSelectedBot] = useState(6);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  //user stuff
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [familiarity, setFamiliarity] = useState("");

  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await ensureAnonymousSession();
      } catch (e) {
        console.error("Auth init failed", e);
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  if (!authReady) {
    return (
      <div className="background" style={{ color: "#FFFADE" }}>
        Loading…
      </div>
    );
  }
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
                botList={botList}
                completedChallenges={completedChallenges}
              />
            }
          ></Route>
          <Route
            path="/play2"
            element={
              <Prompt
                selectedBot={selectedBot}
                botList={botList}
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
