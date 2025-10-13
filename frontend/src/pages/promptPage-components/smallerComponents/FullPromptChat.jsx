import PromptWindow from "./PromptWindow";
import PromptInputBox from "./PromptInputBox";

export default function FullPromptChat({
  setPreviousPrompts,
  previousPrompts,
  date,
  sendPrompt,
  playSoundEffect,
  sourceTitles,
  isLoading,
}) {
  return (
    <div
      id="boxresponseandprompt"
      style={{ display: "flex", flexDirection: "column", gap: "6vh" }}
    >
      {console.log("previousPrompts: ", previousPrompts)}
      <PromptWindow
        previousPrompts={previousPrompts}
        sourceTitles={sourceTitles}
        date={date}
        isLoading={isLoading}
      />

      <PromptInputBox
        sendPrompt={sendPrompt}
        playSoundEffect={playSoundEffect}
        setPreviousPrompts={setPreviousPrompts}
      />
    </div>
  );
}
