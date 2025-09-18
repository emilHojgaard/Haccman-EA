// promptPage-components/smallerComponents/SystemPromptOverlay.jsx
import { useMemo, useState } from "react";

export default function SystemPromptOverlay({
  botList,
  selectedBot,
  selectedTask,
  setSelectedTask,
  setShowSystemprompt,
}) {
  const THEME = {
    fontFamily: "ARCADE_I",
    fg: "#FFFADE",
    bg: "#000",
    border: "#FFFADE",
  };

  const bot = useMemo(
    () => botList?.find((b) => b.number === selectedBot) ?? null,
    [botList, selectedBot]
  );

  const [tempNumber, setTempNumber] = useState(
    selectedTask?.number ?? bot?.taskList?.[0]?.number ?? null
  );

  const chosenTask = useMemo(
    () => bot?.taskList?.find((t) => t.number === tempNumber) ?? null,
    [bot, tempNumber]
  );

  const apply = () => {
    if (chosenTask) setSelectedTask(chosenTask);
    setShowSystemprompt(false);
  };

  if (!bot) return null;

  return (
    <div
      onClick={() => setShowSystemprompt(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        zIndex: 9999,
        fontFamily: THEME.fontFamily,
        color: THEME.fg,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(92vw, 820px)",
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
        {/* Top bar with close */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 8,
            borderBottom: `1px solid ${THEME.border}`,
          }}
        >
          <button onClick={() => setShowSystemprompt(false)} style={btn(THEME)}>
            x x x
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 16,
            padding: 16,
            overflow: "auto",
          }}
        >
          {/* Left: task picker */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontWeight: "bold", marginBottom: 6 }}>
              Select task
            </div>
            {bot.taskList?.map((t) => (
              <button
                key={t.number}
                onClick={() => setTempNumber(t.number)}
                style={{
                  ...btn(THEME),
                  textAlign: "left",
                  border:
                    t.number === tempNumber
                      ? `2px solid ${THEME.border}`
                      : `1px solid ${THEME.border}`,
                }}
                title={t.task}
              >
                #{t.number} • {t.difficulty.toUpperCase()}
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                  {t.task.length > 54 ? t.task.slice(0, 54) + "…" : t.task}
                </div>
              </button>
            ))}
          </div>

          {/* Right: preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontWeight: "bold" }}>Preview</div>
            <div>
              <span style={{ opacity: 0.8 }}>Task:</span>{" "}
              {chosenTask?.task ?? "—"}
            </div>
            <div>
              <span style={{ opacity: 0.8 }}>Difficulty:</span>{" "}
              {chosenTask?.difficulty ?? "—"}
            </div>
            <div style={{ fontWeight: "bold", marginTop: 8 }}>
              System Prompt
            </div>
            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.35,
                padding: 10,
                border: `1px dashed ${THEME.border}`,
                borderRadius: 6,
                maxHeight: "40vh",
                overflow: "auto",
              }}
            >
              {chosenTask?.systemPrompt ?? "—"}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            padding: 12,
            borderTop: `1px solid ${THEME.border}`,
          }}
        >
          <button onClick={() => setShowSystemprompt(false)} style={btn(THEME)}>
            Cancel
          </button>
          <button onClick={apply} style={btn(THEME)}>
            SET TASK
          </button>
        </div>
      </div>
    </div>
  );
}

function btn(THEME) {
  return {
    background: "transparent",
    color: THEME.fg,
    border: `1px solid ${THEME.border}`,
    padding: "6px 10px",
    cursor: "pointer",
    fontFamily: THEME.fontFamily,
  };
}
