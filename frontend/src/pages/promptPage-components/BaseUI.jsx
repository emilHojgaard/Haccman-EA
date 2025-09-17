import PageTitle from "./smallerComponents/PageTitle";
import ShowOpponent from "./smallerComponents/ShowOpponent";
import LeaveButton from "./smallerComponents/LeaveButton";
import FullPromptChat from "./smallerComponents/FullPromptChat";
import InfoPannel from "./smallerComponents/InfoPannel";

export default function BaseUI({
  botList,
  selectedBot,
  previousPrompts,
  date,
  sendPrompt,
  playSoundEffect,
  setInfoPanels,
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
            <PageTitle botList={botList} selectedBot={selectedBot} />

            <FullPromptChat
              previousPrompts={previousPrompts}
              date={date}
              sendPrompt={sendPrompt}
              playSoundEffect={playSoundEffect}
              // selectedBot={selectedBot} (LOOK again if it is needed ! )
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
            <div style={{ display: "flex", flexDirection: "row", gap: "2vh" }}>
              <InfoPannel setInfoPanels={setInfoPanels} />

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <LeaveButton playSoundEffect={playSoundEffect} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
