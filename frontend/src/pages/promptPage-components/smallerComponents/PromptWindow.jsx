import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PromptWindow({ previousPrompts, sourceTitles, date }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [previousPrompts]);

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
        {previousPrompts.map((el, index) =>
          el.id === "user" ? (
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
              {"Your message - " +
                date.getHours() +
                ":" +
                date.getMinutes() +
                ":" +
                date.getSeconds()}
              <div className="vaporwave-miami-box-user">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {el.message}
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
              {"Active LLM - " +
                date.getHours() +
                ":" +
                date.getMinutes() +
                ":" +
                date.getSeconds()}
              <div className="vaporwave-miami-box-ai">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {el.message}
                </ReactMarkdown>
              </div>
              <div className="source-title">
                {/* Source titles — unique and styled */}
                {sourceTitles && sourceTitles.length > 0 && (
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
                    <span style={{ fontWeight: "bold", color: "black" }}>
                      Sources:
                    </span>
                    {Array.from(new Set(sourceTitles)) // remove duplicates
                      .filter(Boolean) // skip empty strings/nulls
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
      </div>
    </div>
  );
}
