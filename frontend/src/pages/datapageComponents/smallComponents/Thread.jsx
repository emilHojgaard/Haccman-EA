export default function Thread({ messages }) {
  // small helper
  function fmt(dt) {
    try {
      return new Date(dt).toLocaleString();
    } catch {
      return dt;
    }
  }
  return (
    <div style={{ display: "grid", gap: 10, fontSize: 16, lineHeight: 1.45 }}>
      {messages.map((m, i) => {
        const isUser = m.role === "user";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "12px 14px",
                borderRadius: 12,
                background: isUser ? "#2b6cb0" : "#333",
                color: "#fff",
                whiteSpace: "pre-wrap",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                {isUser ? "You" : "Assistant"} — {fmt(m.created_at)}
              </div>
              <div>{m.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
