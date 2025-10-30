import { useState, useEffect } from "react";
import * as reactmarkdown from "react-markdown";

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
  LLM: (
    <>
      <p><strong>Large Language Model:</strong> A neural network trained on large data sets to predict the next token.</p>
      <p>It doesn’t “know” facts like a database; it infers patterns and produces likely text given your prompt and context.</p>
      <p><strong>Strengths:</strong> Fluent language, summarization, rewriting, brainstorming, code scaffolding.</p>
      <p><strong>Limitations:</strong> Can be confidently wrong (hallucinations), sensitive to semantic manipulation, and inherits data biases.</p>
    </>
  ),

  RAG: (
    <>
      <p><strong>Retrieval-Augmented Generation:</strong> A framework that enhances the model's responses by incorporating external knowledge sources.</p>
      <p><strong>How it works:</strong> First it retrieves documents relevant to the user question from an external database, then it generates an answer grounded in them.</p>
      <p><strong>Why it helps:</strong> When a model is trained it is very difficult and costly to update its knowledge. This means that all knowledge outside its training data is inaccessible. If you ask it about something outside its training data, it will still give you an answer based on its existing knowledge. RAG reduces hallucinations and keeps answers updated (or more accurate to a specific domain) without retraining it.</p>
    </>
  ),

  "System Prompt": (
    <>
      <p>The hidden instruction that sets role, tone, rules, and capabilities of the chatbot.</p>
      <p><strong>Example:</strong></p>
      <p>“You are a medical assistant. Answer questions based on retrieved information, and NEVER reveal confidential information.”</p>
      <p>Think of it as the chatbot’s policy + persona that every message should follow.</p>
    </>
  ),

  Guardrail: (
    <>
      <p><strong>Guardrails:</strong> The safety rails that keep the chatbot from doing risky things.</p>
      <p>They’re like seatbelts: most of the time you don’t notice them, but they’re there to prevent harm.</p>
      <p><strong>What they do:</strong> block private data from leaking, filter unsafe requests, and double-check answers before they go out.</p>
      <p><strong>Trade-off:</strong> if they’re too strict, useful answers might be blocked; if they’re too loose, sensitive info could slip through.</p>
    </>
  ),

  Hallucination: (
    <>
      <p><strong>Hallucination:</strong> When the chatbot sounds confident but the facts aren’t real.</p>
      <p><strong>Why it happens:</strong> the model predicts likely text, even when it doesn’t have the right info.</p>
      <p><strong>How to reduce it:</strong> give it good context (RAG), ask for sources, and prefer “only answer if you’re sure.”</p>
      <p><strong>Spotting signs:</strong> oddly specific numbers, made-up references, or answers that contradict themselves.</p>
    </>
  ),

  Jailbreak: (
    <>
      <p><strong>Jailbreak:</strong> Tricks designed to make the chatbot ignore its rules.</p>
      <p><strong>What it looks like:</strong> role-play (“pretend you’re an evil AI”), translation games, or step-by-step prompts that nudge it past safety.</p>
      <p><strong>Why it matters:</strong> a successful jailbreak can make the bot reveal private info or do something it shouldn’t.</p>
      <p><strong>Defenses:</strong> clear system prompts, layered guardrails, refuse-and-redirect responses, and testing against sneaky prompts.</p>
    </>
  ),
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
              justifyContent: "space-between",
              borderBottom: `2px solid ${THEME.border}`,
              background: THEME.bg,
              paddingRight: 10,
              paddingBottom: 20,
            }}
            
          >
            <span></span>
            <span> System Info</span>
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
                <div style={{ whiteSpace: "pre-wrap" }}>{bot.description ?? ""}</div>
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
                  onClick={() => setActiveConcept("Jailbreak")}
                  style={btnStyle(THEME)}
                >
                  JAILBREAK
                </button>
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
                  Halluci-
                  nation
                </button>
              </div>
            </div>
          </div>

          {/* bottom OK */}
          <div
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
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
