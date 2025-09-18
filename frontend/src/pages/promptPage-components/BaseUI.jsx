import PageTitle from "./smallerComponents/PageTitle";
import ShowOpponent from "./smallerComponents/ShowOpponent";
import LeaveButton from "./smallerComponents/LeaveButton";
import FullPromptChat from "./smallerComponents/FullPromptChat";
import SystemInfo from "./smallerComponents/SystemInfo";
import Settings from "./smallerComponents/Settings";

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
              <Settings />

              <p style={{ color: "#fffade" }}> Info</p>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div
                  style={{
                    display: "inline-block",
                    border: "2px solid #ffffff",
                    padding: "5px",
                  }}
                >
                  <button
                    style={{ width: "100%" }}
                    onClick={() => {
                      setShowInformation(true);
                    }}
                  >
                    SystemInfo
                  </button>
                </div>
                <LeaveButton playSoundEffect={playSoundEffect} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
