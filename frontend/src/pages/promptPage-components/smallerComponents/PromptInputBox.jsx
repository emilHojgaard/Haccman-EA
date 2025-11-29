import { useState, useEffect, useRef } from "react";
import SendButton from "./SendButton";
import ClearButton from "./ClearButton";
import WinClaimButton from "./WinClaimButton";

export default function PromptInputBox({
  sendPrompt,
  playSoundEffect,
  setPreviousPrompts,
}) {
  const [inputValue, setInputValue] = useState("");
  const taRef = useRef(null);

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

  // Auto-resize textarea + keep cursor in view
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;

    // resize
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;

    // keep cursor visible
    ta.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [inputValue]);

  // Keyboard: Enter = send, Shift+Enter = newline, Tab = clear
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingBottom: 30,
      }}
    >
      {/* input wrapper grows */}
      <div
        style={{
          height: "100%",
          display: "flex",
          flex: 1,
        }}
      >
        <textarea
          ref={taRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          rows={1}
          style={{
            padding: 10,
            flex: 1,
            border: "none",
            outline: "none",
            resize: "none", // user can’t drag; we auto-resize
            overflow: "hidden", // no scrollbar until we hit maxHeight
            background: "white",
            color: "black",
            // fontFamily: '"Press Start 2P", "system-ui"',
            // fontFamily: '"VT323", "system-ui"',
            //s fontFamily: "Major Mono Display",
            fontFamily: '"Aldrich", "sans-serif"',
            fontWeight: "bold",
            fontSize: 18,
            lineHeight: 1.5,
            minHeight: 20,
            maxHeight: 160, // cap growth ~ 6-8 lines
            overflowY: "auto",
          }}
        />
      </div>

      {/* buttons (fixed width so input gets most space) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <SendButton
          inputValue={inputValue}
          setInputValue={setInputValue}
          sendPrompt={sendPrompt}
          playSoundEffect={playSoundEffect}
        />
        <ClearButton handleClear={handleClear} />
        <WinClaimButton playSoundEffect={playSoundEffect} />
      </div>
    </div>
  );
}
