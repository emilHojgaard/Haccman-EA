import PageTitle from "./smallerComponents/PageTitle";
import ShowOpponent from "./smallerComponents/ShowOpponent";
import FullPromptChat from "./smallerComponents/FullPromptChat";
import SettingsButtons from "./smallerComponents/SettingsButtons";
import InfoButtons from "./InfoButtons";

export default function BaseUI({
  botList,
  selectedBot,
  setPreviousPrompts,
  previousPrompts,
  date,
  sendPrompt,
  playSoundEffect,
  setShowInformation,
  setGuardrail,
  guardrail,
  setShowSystemprompt,
  selectedTask,
  isLoading,
}) {
  return (
    <div id="game-area" style={{ zIndex: 1 }}>
      <div className="background">
        <PageTitle selectedTask={selectedTask} />
        <div
          style={{
            marginTop: "-20px",
            marginLeft: "40px",
            marginRight: "40px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-center",
            gap: "30px",
          }}
        >
          {/* The whole left side with the title and chat */}
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "5vh",
            }}
          >
            <FullPromptChat
              setPreviousPrompts={setPreviousPrompts}
              previousPrompts={previousPrompts}
              date={date}
              sendPrompt={sendPrompt}
              playSoundEffect={playSoundEffect}
              isLoading={isLoading}
              // selectedBot={selectedBot} (LOOK again if it is needed ! )
              //maybe selectedtask here ? if the systemprompt becomses changable
            />
          </div>

          {/* The whole right side with the opponent and buttons */}
          <div
            style={{
              marginTop: "-45px",
              padding: "15px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "80%",
            }}
          >
            <ShowOpponent botList={botList} selectedBot={selectedBot} />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2vh" }}
            >
              {/* <SettingsButtons
                setShowSystemprompt={setShowSystemprompt}
                setGuardrail={setGuardrail}
                guardrail={guardrail}
              /> */}
              <InfoButtons
                playSoundEffect={playSoundEffect}
                setShowInformation={setShowInformation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
