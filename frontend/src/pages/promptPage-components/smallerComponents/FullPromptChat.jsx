import PromptWindow from "./PromptWindow";
import PromptInputBox from "./PromptInputBox";

export default function FullPromptChat({
  previousPrompts,
  date,
  usingMemory,
  sendPrompt,
  playSoundEffect,
}) {
  return (
    <div
      id="boxresponseandprompt"
      style={{ display: "flex", flexDirection: "column", gap: "6vh" }}
    >
      <PromptWindow previousPrompts={previousPrompts} date={date} />

      <PromptInputBox
        onSend={sendPrompt}
        playSoundEffect={playSoundEffect}
        usingMemory={usingMemory}
      />
    </div>
  );
}
