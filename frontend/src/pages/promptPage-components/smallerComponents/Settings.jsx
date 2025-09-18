export default function Settings() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vh",
      }}
    >
      <p style={{ color: "white" }}>Settings</p>
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
            // Open the system prompt info panel
          }}
        >
          Set Systemprompt
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
            // toggle guardrail on/off
          }}
        >
          Guardrail On/Off
        </button>
      </div>
    </div>
  );
}
