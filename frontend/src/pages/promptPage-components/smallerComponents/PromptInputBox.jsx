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
        justifyContent: "center",
        paddingBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          border: "2px solid #ffffff",
          padding: "5px",
          flex: 3
        }}
      >
        <input
          style = {{flex: 1}}
          type="text"
          id="textInputField"
          className="the-vaporwave-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
      </div>
      
      <div style = {{flex: 1, display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px", paddingLeft: "10px"}}> 
        <SendButton
          style = {{flex: 1}}
          inputValue={inputValue}
          setInputValue={setInputValue}
          sendPrompt={sendPrompt}
          playSoundEffect={playSoundEffect}
        />
        <ClearButton 
          style = {{flex: 1}}
          handleClear={handleClear} 
        />
      </div>
    </div>
  );
}
