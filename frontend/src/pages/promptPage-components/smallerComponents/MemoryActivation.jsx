export default function MemoryActivation({ usingMemory, setUsingMemory }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
      <div
        style={{
          display: "flex",
          border: "2px solidrgb(0, 0, 0)",
          padding: "5px",
        }}
      >
        <button
          id="sendButton"
          className="the-vaporwave-button2"
          onClick={() => setUsingMemory(!usingMemory)}
        >
          {usingMemory && "Memory is activated"}
          {!usingMemory && "Memory is DESACTIVATED"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          border: "2px solidrgb(0, 0, 0)",
          padding: "5px",
          color: "white",
        }}
      >
        {usingMemory &&
          "The models will remember previous messages inside each conversation."}
        {!usingMemory &&
          "The models will NOT remember previous messages inside each conversation."}
      </div>
    </div>
  );
}
