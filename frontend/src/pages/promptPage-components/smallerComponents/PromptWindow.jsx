import { useEffect, useRef } from "react";

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
              <div className="vaporwave-miami-box-user">{el.message}</div>
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
              <div className="vaporwave-miami-box-ai">{el.message}</div>
              <div className="source-title">
                {sourceTitles.map((source, i) => (
                  <div key={i}>{source.title}</div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
