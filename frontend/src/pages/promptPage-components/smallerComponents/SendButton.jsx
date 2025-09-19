export default function SendButton({
  inputValue,
  setInputValue,
  onSend,
  playSoundEffect,
}) {
  const handleClick = () => {
    playSoundEffect?.("select");
    const text = (inputValue || "").trim();
    if (!text) return;
    onSend(text);
    setInputValue?.("");
  };

  return (
    <div
      style={{
        display: "flex",
        border: "2px solid #ffffff",
        padding: "5px",
        width: "10%",
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
