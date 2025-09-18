export default function SettingsButtons({ setShowSystemprompt }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vh",
      }}
    >
      <p style={{ color: "#fffade" }}>Settings</p>
      <div
        style={{
          display: "inline-block",
          border: "2px solid #fffade",
          padding: "5px",
        }}
      >
        <button
          style={{ width: "100%" }}
          onClick={() => {
            setShowSystemprompt(true);
          }}
        >
          Set Systemprompt
        </button>
      </div>
      <div
        style={{
          display: "inline-block",
          border: "2px solid #fffade",
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
