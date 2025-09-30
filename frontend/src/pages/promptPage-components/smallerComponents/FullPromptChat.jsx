import PromptWindow from "./PromptWindow";
import PromptInputBox from "./PromptInputBox";

export default function FullPromptChat({
  setPreviousPrompts,
  previousPrompts,
  date,
  sendPrompt,
  playSoundEffect,
  sourceTitles,
}) {
  return (
    <div
      id="boxresponseandprompt"
      style={{ display: "flex", flexDirection: "column", gap: "6vh" }}
    >
      <PromptWindow
        previousPrompts={previousPrompts}
        sourceTitles={sourceTitles}
        date={date}
      />

      <PromptInputBox
        onSend={sendPrompt}
        playSoundEffect={playSoundEffect}
        setPreviousPrompts={setPreviousPrompts}
      />
    </div>
  );
}
