export default function GuardrailSwitch({ setGuardrailOn }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        justifyContent: "center",
      }}
    >
      <div className="beaten"></div>
      <div className="beaten-back"></div>
    </div>
  );
}
