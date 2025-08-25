import { useState, useEffect } from "react";
import SendButton from "./SendButton";
import ClearButton from "./ClearButton";

export default function PromptInputBox({
  onSend, // sendPrompt or oldSendPrompt
  onClear, // clear previous prompts
  playSoundEffect,
  usingMemory = true, // toggle memory mode
}) {
  const [inputValue, setInputValue] = useState("");

  const date = new Date();

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    playSoundEffect?.("select");
    onSend(text);
    setInputValue("");
  };

  const handleClear = () => {
    playSoundEffect?.("select");
    onClear?.();
  };

  // Keyboard shortcuts: Enter = Send, Tab = Clear
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputValue, usingMemory]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <input
        type="text"
        id="textInputField"
        className="the-vaporwave-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
      />

      <SendButton
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={onSend}
        playSoundEffect={playSoundEffect}
        usingMemory={usingMemory}
      />
      <ClearButton onClear={handleClear} />
    </div>
  );
}
