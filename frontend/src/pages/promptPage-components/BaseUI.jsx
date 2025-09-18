import PageTitle from "./smallerComponents/PageTitle";
import ShowOpponent from "./smallerComponents/ShowOpponent";
import LeaveButton from "./smallerComponents/LeaveButton";
import FullPromptChat from "./smallerComponents/FullPromptChat";
import SystemInfo from "./smallerComponents/SystemInfo";
import SettingsButtons from "./smallerComponents/SettingsButtons";
import InfoButtons from "./InfoButtons";

export default function BaseUI({
  botList,
  selectedBot,
  previousPrompts,
  date,
  sendPrompt,
  playSoundEffect,
  setShowInformation,

  setGuardrailOn,
  setShowSystemprompt,
  selectedTask,
  setSelectedTask,
}) {
  return (
    <div style={{ zIndex: 1 }}>
      <div className="background">
        <div
          style={{
            marginTop: "40px",
            marginLeft: "40px",
            display: "flex",
            flexDirection: "row",
            gap: "50px",
            justifyContent: "space-around",
          }}
        >
          {/* The whole left side with the title and chat */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5vh",
              width: "60%",
            }}
          >
            <PageTitle selectedTask={selectedTask} />

            <FullPromptChat
              previousPrompts={previousPrompts}
              date={date}
              sendPrompt={sendPrompt}
              playSoundEffect={playSoundEffect}
              // selectedBot={selectedBot} (LOOK again if it is needed ! )
              //maybe selectedtask here ? if the systemprompt becomses changable
            />
          </div>

          {/* The whole right side with the opponent and buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              alignItems: "center",
              justifyContent: "space-between",
              height: "99%",
            }}
          >
            <ShowOpponent botList={botList} selectedBot={selectedBot} />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2vh" }}
            >
              <SettingsButtons setShowSystemprompt={setShowSystemprompt} />
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
