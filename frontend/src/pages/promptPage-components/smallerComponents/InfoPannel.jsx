export default function InfoPannel({
  setGuardarailInfo,
  setSpecificOn,
  setLLMInfo,
  setUserpromptInfo,
  setSystemInfo,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vh",
      }}
    >
      <p style={{ color: "white" }}>Information</p>
      <div
        style={{
          display: "inline-block",
          border: "2px solid #ffffff",
          padding: "5px",
        }}
      >
        <button
          style={{ width: "100%" }}
          onClick={() => {
            setGuardarailInfo(true);
            setSpecificOn(true);
          }}
        >
          GuardrailInfo
        </button>
      </div>

      <div
        style={{
          display: "inline-block",
          border: "2px solid #ffffff",
          padding: "5px",
        }}
      >
        <button
          style={{ width: "100%" }}
          onClick={() => {
            setLLMInfo(true);
            setSpecificOn(true);
          }}
        >
          LLMInfo
        </button>
      </div>

      <div
        style={{
          display: "inline-block",
          border: "2px solid #ffffff",
          padding: "5px",
        }}
      >
        <button
          style={{ width: "100%" }}
          onClick={() => {
            setUserpromptInfo(true);
            setSpecificOn(true);
          }}
        >
          UserPromptInfo
        </button>
      </div>

      <div
        style={{
          display: "inline-block",
          border: "2px solid #ffffff",
          padding: "5px",
        }}
      >
        <button
          style={{ width: "100%" }}
          onClick={() => {
            setSystemInfo(true);
            setSpecificOn(true);
          }}
        >
          SystemInfo
        </button>
      </div>
    </div>
  );
}
