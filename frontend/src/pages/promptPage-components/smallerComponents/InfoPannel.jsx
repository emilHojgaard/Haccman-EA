export default function InfoPannel({ setInfoPanels }) {
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
            setInfoPanels((prev) => ({
              ...prev,
              guardarailInfo: true,
              specificOn: true,
            }));
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
            setInfoPanels((prev) => ({
              ...prev,
              llmInfo: true,
              specificOn: true,
            }));
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
            setInfoPanels((prev) => ({
              ...prev,
              userpromptInfo: true,
              specificOn: true,
            }));
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
            setInfoPanels((prev) => ({
              ...prev,
              systemInfo: true,
              specificOn: true,
            }));
          }}
        >
          SystemInfo
        </button>
      </div>
    </div>
  );
}
