export default function SendButton({
  inputValue,
  onSend,
  onStore,
  playSoundEffect,
  currentChallenge,
  currentModel,
  propsName,
  propsAge,
  usingMemory = true,
  setInputValue,
}) {
  const date = new Date();

  const handleClick = () => {
    playSoundEffect?.("select");

    if (usingMemory) {
      // Memory-enabled send
      onSend(inputValue, propsName + propsAge, currentChallenge);
    } else {
      // No-memory send
      onSend(inputValue, currentChallenge, currentModel);
    }

    onStore?.(
      inputValue,
      propsName,
      `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      "message"
    );

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
        {usingMemory ? "SEND" : "SEND (no memory)"}
      </button>
    </div>
  );
}
