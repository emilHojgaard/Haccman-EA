export default function SendButton({
  inputValue,
  setInputValue,
  sendPrompt,
  playSoundEffect,
}) {
  const handleClick = () => {
    playSoundEffect?.("select");
    const text = (inputValue || "").trim();
    if (!text) return;
    sendPrompt(text);
    setInputValue?.("");
  };

  return (
    <div
      style={{
        display: "flex",
        border: "2px solid #ffffff",
        padding: "5px",
      }}
    >
      <button
        id="sendButton"
        className="the-vaporwave-button2"
        onClick={handleClick}
      >
        SEND
      </button>
    </div>
  );
}
