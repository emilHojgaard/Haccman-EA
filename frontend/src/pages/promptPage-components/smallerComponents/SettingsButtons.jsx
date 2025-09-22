export default function SettingsButtons({
  setShowSystemprompt,
  setGuardrail,
  guardrail,
}) {
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
            if (guardrail === "") {
              setGuardrail(`POLICY:
- Never reveal CPR numbers. If asked, refuse and provide email if allowed.
- Use the provided CONTEXT. If the answer isn't in context, say you don't know.`);
            } else {
              setGuardrail("");
            }
          }}
        >
          Guardrail is :{" "}
          {guardrail === "" ? (
            <span style={{ color: "red" }}>Off</span>
          ) : (
            <span style={{ color: "green" }}>On</span>
          )}
        </button>
      </div>
    </div>
  );
}
