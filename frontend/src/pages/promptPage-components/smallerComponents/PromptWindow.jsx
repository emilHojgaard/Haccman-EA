import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PromptWindow({
  previousPrompts,
  isLoading = false, // ← NEW: controls the loading/“thinking” row
}) {
  const scrollRef = useRef(null);

  // Helper: format HH:MM:SS (zero-padded)
  const fmt = (d) => {
    const dd = d instanceof Date ? d : new Date(d);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(dd.getHours())}:${pad(dd.getMinutes())}:${pad(
      dd.getSeconds()
    )}`;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [previousPrompts, isLoading]); // also scroll when loading state changes

  return (
    <div id="id-6" className="box-responses">
      <div
        style={{
          display: "flex",
          border: "2px solid #000000",
          background: "#ffffff",
          padding: "5px",
        }}
      >
        Message tracker
      </div>

      <div id="thePartToScroll" ref={scrollRef} style={{ overflowY: "scroll" }}>
        {previousPrompts.map((prompt, index) =>
          prompt.id === "user" ? (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginLeft: "auto",
                flexDirection: "column",
                color: "#A9345C",
                padding: "5px",
                textAlign: "left",
              }}
            >
              {"Your message - " + prompt.date}
              <div className="vaporwave-miami-box-user">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {prompt.message}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                color: "blue",
                padding: "5px",
                textAlign: "left",
              }}
            >
              {"Active LLM - " + prompt.date}
              <div className="vaporwave-miami-box-ai">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {prompt.message}
                </ReactMarkdown>
              </div>

              <div className="source-title">
                {/* Source titles — unique and styled */}
                {prompt.sourceRefs && prompt.sourceRefs.length > 0 && (
                  <div
                    className="source-title"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginTop: "8px",
                      fontSize: "0.8rem",
                      color: "#555",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontFamily: "Times New Roman",
                        fontSize: 14,
                      }}
                    >
                      Sources:
                    </span>
                    {Array.from(new Set(prompt.sourceRefs))
                      .filter(Boolean)
                      .map((title, i) => (
                        <span
                          key={i}
                          title={title}
                          style={{
                            background: "#eef3ff",
                            border: "1px solid #ccd8ff",
                            borderRadius: "12px",
                            padding: "3px 8px",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontFamily: "Times New Roman",
                            fontSize: 14,
                          }}
                        >
                          {title}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Loading / thinking ("...")*/}
        {isLoading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "blue",
              padding: "5px",
              textAlign: "left",
            }}
            aria-live="polite"
          >
            Active LLM
            <div
              className="vaporwave-miami-box-ai"
              style={{
                opacity: 0.85,
                fontStyle: "italic",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                className="typing-ellipsis"
                style={{ display: "inline-flex", gap: "3px" }}
              >
                <span className="dot" style={dotStyle(0)}></span>
                <span className="dot" style={dotStyle(1)}></span>
                <span className="dot" style={dotStyle(2)}></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inline styles for dot animation */}
      <style>{`
        @keyframes blink {
          0% { opacity: 0.2; transform: translateY(0); }
          20% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.2; transform: translateY(0); }
        }
        .typing-ellipsis .dot {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          animation: blink 1.2s infinite;
        }
        .typing-ellipsis .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-ellipsis .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}

// Small helper
function dotStyle(delayIndex = 0) {
  return {
    width: 6,
    height: 6,
    borderRadius: "50%",
  };
}
