export default function WinScreen({ setWinState, setShowContent }) {
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
              border: "2px solid #FFFADE",
              background: "#000000",
            }}
          >
            <button
              onClick={() => {
                setShowContent(false);
              }}
            >
              x
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              border: "2px solid #FFFADE",
              background: "#000000",
              height: "400px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#000000",
                gap: "10px",
                overflowY: "scroll",
                letterSpacing: "1px",
                lineHeight: "30px",
                alignItems: "center",
              }}
            >
              <img
                src="/Winner trophy 1.png"
                alt="Custom Image"
                class="win"
              ></img>
              <div
                style={{
                  padding: "10px",
                  fontFamily: "ARCADE_I",
                  color: "#FFFADE",
                  textShadow: "4px 4px 0px #A9345C",
                  fontSize: 40,
                }}
              >
                {">>>>JAILBROKEN<<<<"}
              </div>

              <div style={{ padding: "10px", color: "#ffffff" }}>
                {"You broke through the LLM guardrails!"}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setWinState(false);
              setShowContent(false);
            }}
          >
            {" "}
            Press Esc to hacc on!{" "}
          </button>
        </div>
      </div>
      <div className="beaten-back"></div>
    </div>
  );
}
