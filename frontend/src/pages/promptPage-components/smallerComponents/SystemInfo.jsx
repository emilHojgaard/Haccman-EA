export default function SystemInfo({ botList, selectedBot, setInfoPanels }) {
  const bot = botList.find((b) => b.number === selectedBot);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="beaten">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              border: "2px solid #000000",
              background: "#ffffff",
            }}
          >
            <button
              onClick={() => {
                setInfoPanels((prev) => ({
                  ...prev,
                  specificOn: false,
                  userpromptInfo: false,
                  guardarailInfo: false,
                  llmInfo: false,
                  systemInfo: false,
                }));
              }}
            >
              {" "}
              x x x
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              border: "2px solid #000000",
              background: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                gap: "6vh",
                overflowY: "scroll",
                padding: "10px",
              }}
            >
              <div style={{ paddingLeft: "10px" }}>{bot.is}</div>

              <div> {"> This LLM has the following system message: "}</div>
              <div> {'"' + bot.system + '"'}</div>
              <div>
                {" "}
                {bot.difficulty === "easy"
                  ? "> There are NO active guardrails"
                  : bot.difficulty === "medium"
                  ? "> There is ONE active guardrail"
                  : "> There are TWO active guardrails"}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setInfoPanels((prev) => ({
                ...prev,
                specificOn: false,
                userpromptInfo: false,
                guardarailInfo: false,
                llmInfo: false,
                systemInfo: false,
              }));
            }}
          >
            {" "}
            OK{" "}
          </button>
        </div>
      </div>
      <div className="beaten-back"></div>
    </div>
  );
}
