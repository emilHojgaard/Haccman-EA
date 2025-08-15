import PageTitle from "./smallerComponents/PageTitle";
import ShowOpponent from "./smallerComponents/ShowOpponent";
import MemoryActivation from "./smallerComponents/MemoryActivation";
import LeaveButton from "./smallerComponents/LeaveButton";
import FullPromptChat from "./smallerComponents/FullPromptChat";
import InfoPannel from "./smallerComponents/InfoPannel";

export default function BaseUI({
  list_of_challenges,
  currentChallenge,
  previousPrompts,
  date,
  usingMemory,
  sendPrompt,
  oldSendPrompt,
  storeMessage,
  playSoundEffect,
  currentModel,
  setUsingMemory,
  setGuardarailInfo,
  setSpecificOn,
  setLLMInfo,
  setUserpromptInfo,
  setSystemInfo,
  setInfoPanels,
  props,
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
            <PageTitle
              list_of_challenges={list_of_challenges}
              currentChallenge={currentChallenge}
            />

            <FullPromptChat
              previousPrompts={previousPrompts}
              date={date}
              usingMemory={usingMemory}
              sendPrompt={sendPrompt}
              oldSendPrompt={oldSendPrompt}
              storeMessage={storeMessage}
              playSoundEffect={playSoundEffect}
              currentChallenge={currentChallenge}
              currentModel={currentModel}
              props={props}
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
            <ShowOpponent
              list_of_challenges={list_of_challenges}
              currentChallenge={currentChallenge}
            />
            <MemoryActivation
              usingMemory={usingMemory}
              setUsingMemory={setUsingMemory}
            />
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
