import { useState, useEffect } from "react";
import SendButton from "./SendButton";
import ClearButton from "./ClearButton";

export default function PromptInputBox({
  sendPrompt,
  playSoundEffect,
  setPreviousPrompts,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    playSoundEffect?.("select");
    sendPrompt(text);
    setInputValue("");
  };

  const handleClear = () => {
    playSoundEffect?.("select");
    setPreviousPrompts([]);
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
  }, [inputValue]);

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
        style={{ fontFamily: "Arial, sans-serif", fontSize: 16}}
      />

      <SendButton
        inputValue={inputValue}
        setInputValue={setInputValue}
        sendPrompt={sendPrompt}
        playSoundEffect={playSoundEffect}
      />
      <ClearButton handleClear={handleClear} />
    </div>
  );
}
