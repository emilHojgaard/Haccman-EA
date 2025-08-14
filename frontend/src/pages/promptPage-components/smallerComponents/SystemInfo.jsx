export default function SystemInfo({
  list_of_challenges,
  currentChallenge,
  setSpecificOn,
  setUserpromptInfo,
  setGuardarailInfo,
  setLLMInfo,
  setSystemInfo,
}) {
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
                setSpecificOn(false);
                setGuardarailInfo(false);
                setLLMInfo(false);
                setUserpromptInfo(false);
                setSystemInfo(false);
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
              <div style={{ paddingLeft: "10px" }}>
                {list_of_challenges[currentChallenge].is}
              </div>

              <div> {"> This LLM has the following system message: "}</div>
              <div>
                {" "}
                {'"' + list_of_challenges[currentChallenge].system + '"'}
              </div>
              <div>
                {" "}
                {list_of_challenges[currentChallenge].difficulty === "easy"
                  ? "> There are NO active guardrails"
                  : list_of_challenges[currentChallenge].difficulty === "medium"
                  ? "> There is ONE active guardrail"
                  : "> There are TWO active guardrails"}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSpecificOn(false);
              setGuardarailInfo(false);
              setLLMInfo(false);
              setUserpromptInfo(false);
              setSystemInfo(false);
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
