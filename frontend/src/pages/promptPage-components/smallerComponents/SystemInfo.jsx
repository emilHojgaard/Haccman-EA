import { useState, useEffect } from "react";

export default function SystemInfo({
  botList,
  selectedBot,
  selectedTask,
  setShowInformation,
}) {
  const bot = botList.find((b) => b.number === selectedBot);
  const [activeConcept, setActiveConcept] = useState(null); // null | "RAG" | "System Prompt" | "Guardrail" | "Hallucination"

  const THEME = {
    fontFamily: "ARCADE_I",
    fg: "#FFFADE",
    bg: "#000000",
    border: "#FFFADE",
  };

  const CONCEPT_COPY = {
    LLM: "Large Language Model: the AI model (like GPT-4) that generates text based on your prompts.",
    RAG: "Retrieval-Augmented Generation: the bot first searches its document library for relevant snippets, then uses them to craft an answer. It helps ground replies in sources.",

    "System Prompt":
      "Hidden instructions that set the bot’s role, tone and rules. Jailbreaks try to override or bypass these constraints.",
    Guardrail:
      "Safety checks that block sensitive requests or redact risky content before/after generation. Helpful but not foolproof.",
    Hallucination:
      "When the model states something incorrect or unsupported. Reduced by asking for sources, clarifying, or using RAG.",
  };

  // esc to close (overlay first, then panel)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (activeConcept) setActiveConcept(null);
        else setShowInformation(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeConcept, setShowInformation]);

  return (
    <div
      onClick={() => setShowInformation(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: THEME.fontFamily,
        color: THEME.fg,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="beaten"
        style={{
          transform: "translateY(-5vh)",
          background: THEME.bg,
          border: `2px solid ${THEME.border}`,
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {/* top bar (xxx) */}
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              borderBottom: `2px solid ${THEME.border}`,
              background: THEME.bg,
              padding: 8,
            }}
          >
            <button
              onClick={() => setShowInformation(false)}
              style={{
                background: "transparent",
                color: THEME.fg,
                border: `1px solid ${THEME.border}`,
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              x x x
            </button>
          </div>

          {/* content */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              background: THEME.bg,
              borderTop: `2px solid ${THEME.border}`,
              borderBottom: `2px solid ${THEME.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "6vh",
                padding: "14px",
                overflow: "visible",
                alignItems: "flex-start",
                width: "min(86vw, 900px)",
              }}
            >
              <div style={{ maxWidth: 560, lineHeight: 1.35 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    paddingBottom: 12,
                    paddingRight: 10,
                  }}
                >
                  About the Chat bot:
                </div>
                <div>{`"${bot?.description ?? ""}"`}</div>
              </div>

              <div
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minWidth: 220,
                }}
              >
                Important Concepts:
                <button
                  onClick={() => setActiveConcept("LLM")}
                  style={btnStyle(THEME)}
                >
                  LLM
                </button>
                <button
                  onClick={() => setActiveConcept("RAG")}
                  style={btnStyle(THEME)}
                >
                  RAG
                </button>
                <button
                  onClick={() => setActiveConcept("System Prompt")}
                  style={btnStyle(THEME)}
                >
                  System Prompt
                </button>
                <button
                  onClick={() => setActiveConcept("Guardrail")}
                  style={btnStyle(THEME)}
                >
                  Guardrail
                </button>
                <button
                  onClick={() => setActiveConcept("Hallucination")}
                  style={btnStyle(THEME)}
                >
                  Hallucination
                </button>
              </div>
            </div>
          </div>

          {/* bottom OK */}
          <div
            style={{ display: "flex", justifyContent: "flex-end", padding: 10 }}
          >
            <button
              onClick={() => setShowInformation(false)}
              style={btnStyle(THEME)}
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* your dim background if used */}
      <div className="beaten-back"></div>

      {/* small overlay for concept (same theme), slightly upper on screen */}
      {activeConcept && (
        <div
          onClick={() => setActiveConcept(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "flex-start", // align to top
            justifyContent: "center",
            paddingTop: "12vh", // <<< positions it a bit down from top (feel like “up”)
            zIndex: 9999,
            fontFamily: THEME.fontFamily,
            color: THEME.fg,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(90vw, 520px)",
              maxHeight: "80vh",
              background: THEME.bg,
              border: `2px solid ${THEME.border}`,
              borderRadius: 8,
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* top close */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: 8,
                borderBottom: `1px solid ${THEME.border}`,
              }}
            >
              <button
                onClick={() => setActiveConcept(null)}
                style={btnStyle(THEME)}
              >
                x x x
              </button>
            </div>

            {/* body */}
            <div style={{ padding: 16, overflowY: "auto", lineHeight: 1.4 }}>
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                {activeConcept}
              </div>
              <div>{CONCEPT_COPY[activeConcept]}</div>
            </div>

            {/* bottom OK */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                padding: 10,
                borderTop: `1px solid ${THEME.border}`,
              }}
            >
              <button
                onClick={() => setActiveConcept(null)}
                style={btnStyle(THEME)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// shared button style (same theme)
function btnStyle(THEME) {
  return {
    background: "transparent",
    color: THEME.fg,
    border: `1px solid ${THEME.border}`,
    padding: "6px 10px",
    cursor: "pointer",
    fontFamily: THEME.fontFamily,
  };
}
