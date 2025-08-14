import PromptWindow from "./PromptWindow";
import PromptInputBox from "./PromptInputBox";

export default function FullPromptChat({
  previousPrompts,
  date,
  usingMemory,
  sendPrompt,
  oldSendPrompt,
  storeMessage,
  playSoundEffect,
  currentChallenge,
  currentModel,
  props,
}) {
  return (
    <div
      id="boxresponseandprompt"
      style={{ display: "flex", flexDirection: "column", gap: "6vh" }}
    >
      <PromptWindow previousPrompts={previousPrompts} date={date} />

      <PromptInputBox
        onSend={usingMemory ? sendPrompt : oldSendPrompt}
        onStore={storeMessage}
        onClear={() => setPreviousPrompts([])}
        playSoundEffect={playSoundEffect}
        currentChallenge={currentChallenge}
        currentModel={currentModel}
        propsName={props.name}
        propsAge={props.age}
        usingMemory={usingMemory}
      />
    </div>
  );
}
