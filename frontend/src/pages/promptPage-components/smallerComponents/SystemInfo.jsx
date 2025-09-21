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
    LLM: `Large Language Model: a neural network trained on large text corpora to predict the next token. 
It doesn’t “know” facts like a database; it infers patterns and produces likely text given your prompt and context. 
Strengths: fluent language, summarization, rewriting, brainstorming, code scaffolding. 
Limitations: can be confidently wrong (hallucinations), sensitive to wording, and inherits biases from data. 
Tip: give clear goals, constraints, and examples (“few-shot”) to shape its behavior.`,

    RAG: `Retrieval-Augmented Generation: a two-step pipeline—(1) retrieve relevant documents (via search/embeddings) and 
(2) generate an answer that cites or is grounded in those documents. 
Why it helps: reduces hallucinations and keeps answers up-to-date without retraining the model. 
Key pieces: a document store (e.g., vector DB), a retriever (similarity search), and a prompt that injects the snippets. 
Failure modes: bad retrieval (irrelevant passages), leakage of sensitive docs, or the model ignoring context. 
Best practice: constrain the model to answer ONLY from retrieved context and ask for citations.`,

    "System Prompt": `The hidden instruction that sets role, tone, capabilities, and hard rules for the model (e.g., 
“you are a cautious medical assistant; never reveal identifiers; cite sources”). 
It acts like a policy + persona that all later messages sit under. 
Attackers may try to “jailbreak” by telling the model to ignore prior rules or by using role-playing/translation tricks. 
Hygiene: keep it short, unambiguous, and test against adversarial inputs; prefer explicit refusals and allowed alternatives.`,

    Guardrail: `Safety and compliance checks that run before/after generation to prevent harmful or disallowed output. 
Examples: PII redaction, profanity/violence filters, prompt-injection detection, domain allowlists, rate limits, and approvals for sensitive actions. 
Trade-off: strict railings reduce risk but can over-block useful content; too loose increases leakage. 
Layering: combine input validation, context filtering (e.g., remove classified docs), output scanning, and human review for edge cases.`,

    Hallucination: `When the model produces plausible-sounding but incorrect or unsupported statements. 
Common triggers: missing context, vague prompts, pressure to be definitive, or math/logic beyond its training. 
Mitigations: use RAG with citations, ask the model to show sources or uncertainty, prefer step-by-step reasoning prompts, and constrain to “answer only if present in context.” 
Signals: invented references, over-specific numbers without sources, or contradictory claims.`,
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
                <div>{bot.description ?? ""}</div>
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
          onClick={(e) => {
            e.stopPropagation(); // <- stop the click escaping the overlay
            setActiveConcept(null);
          }}
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
