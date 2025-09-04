import { useEffect, useMemo, useRef, useState } from "react";
import {
  getAllUsernames,
  getSessionsByUser,
  loadMessagesAdmin,
} from "../../apiSupabase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// small helper
function fmt(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

// click-outside hook
function useClickOutside(ref, handler) {
  useEffect(() => {
    function onClick(e) {
      if (!ref.current) return;
      if (ref.current.contains(e.target)) return;
      handler();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, handler]);
}

export default function DataRetrieval() {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]); // [{id, username}]
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); // {id, username}
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [error, setError] = useState("");

  const inputWrapRef = useRef(null);
  const inputRef = useRef(null);
  const threadRef = useRef(null);

  // keep dropdown open while input is focused, close on outside click
  useClickOutside(inputWrapRef, () => setDropdownOpen(false));

  // load all usernames on mount (sorted)
  useEffect(() => {
    (async () => {
      try {
        setLoadingUsers(true);
        setError("");
        const rows = await getAllUsernames();
        setUsers(rows);
      } catch (e) {
        setError(e.message || "Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  // client-side filter (you can switch to server-side search later)
  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.username || "").toLowerCase().includes(q));
  }, [users, query]);

  async function handleSelectUser(user) {
    setSelectedUser(user);
    setDropdownOpen(false);
    setSelectedSessionId(null);
    setMessages([]);
    try {
      setLoadingSessions(true);
      setError("");
      const sess = await getSessionsByUser(user.id);
      setSessions(sess);
    } catch (e) {
      setError(e.message || "Failed to load sessions.");
    } finally {
      setLoadingSessions(false);
    }
  }

  async function handleSelectSession(sessionId) {
    setSelectedSessionId(sessionId);
    try {
      setLoadingMessages(true);
      setError("");
      const rows = await loadMessagesAdmin(sessionId);
      setMessages(rows);
      // scroll to bottom
      setTimeout(() => {
        threadRef.current?.scrollTo({
          top: threadRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
    } catch (e) {
      setError(e.message || "Failed to load messages.");
    } finally {
      setLoadingMessages(false);
    }
  }

  function handleOpenDropdown() {
    setDropdownOpen(true);
    // keep the input focused
    inputRef.current?.focus();
  }

  function handleSearchClick() {
    setDropdownOpen(true);
    inputRef.current?.focus();
  }

  function handlePrint() {
    window.print(); // users can "Save as PDF" in dialog
  }

  // Full-thread PDF (multi-page) using html2canvas + jsPDF
  async function handleDownloadPdf() {
    if (!threadRef.current) return;

    // Temporarily expand the thread to full height (so canvas captures everything)
    const el = threadRef.current;
    const prevMaxHeight = el.style.maxHeight;
    el.style.maxHeight = "none";

    try {
      const canvas = await html2canvas(el, {
        scale: 2, // higher quality
        useCORS: true,
        backgroundColor: "#ffffff", // white background for PDF
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // multi-page
        let y = 0;
        while (y < imgHeight) {
          pdf.addImage(imgData, "PNG", 0, -y, imgWidth, imgHeight);
          y += pageHeight;
          if (y < imgHeight) pdf.addPage();
        }
      }

      pdf.save(
        `conversation_${selectedUser?.username ?? "user"}_${
          selectedSessionId?.slice(0, 8) ?? "session"
        }.pdf`
      );
    } catch (e) {
      setError(e.message || "Failed to generate PDF.");
    } finally {
      // restore size
      el.style.maxHeight = prevMaxHeight || "520px";
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Centered pre-search header */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: 0, color: "#fff" }}>Data retrieval</h2>
        <p style={{ margin: "6px 0 14px 0", color: "#aaa" }}>
          Pick a user → choose a conversation → read/print/download
        </p>
      </div>

      {/* Search + dropdown (black on white) */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          ref={inputWrapRef}
          style={{ position: "relative", width: 420, maxWidth: "90%" }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleOpenDropdown}
              placeholder="Start typing a username…"
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #444",
                borderRadius: 6,
                background: "#fff",
                color: "#000",
                outline: "none",
              }}
            />
            <button
              className="the-vaporwave-button2"
              onClick={handleSearchClick}
              style={{ whiteSpace: "nowrap" }}
            >
              Search
            </button>
          </div>

          {dropdownOpen && filteredUsers.length > 0 && (
            <div
              style={{
                position: "absolute",
                zIndex: 10,
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                maxHeight: 260,
                overflowY: "auto",
                background: "#fff",
                color: "#000",
                border: "1px solid #444",
                borderRadius: 6,
              }}
              // close when input loses focus (slight delay to allow click)
              onMouseDown={(e) => e.preventDefault()}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
            >
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  style={{
                    padding: "8px 10px",
                    cursor: "pointer",
                    borderTop: "1px solid #eee",
                  }}
                >
                  {u.username || "(no name)"}
                </div>
              ))}
            </div>
          )}
          {loadingUsers && (
            <div style={{ color: "#aaa", marginTop: 6 }}>Loading users…</div>
          )}
        </div>
      </div>

      {/* Sessions list */}
      {selectedUser && (
        <div style={{ display: "grid", justifyContent: "center" }}>
          <div
            style={{
              color: "#fff",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Conversations for <strong>{selectedUser.username}</strong>
          </div>

          {loadingSessions ? (
            <div style={{ color: "#aaa", textAlign: "center" }}>
              Loading conversations…
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ color: "#aaa", textAlign: "center" }}>
              No conversations found.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 8,
                maxHeight: 220,
                overflowY: "auto",
                border: "1px solid #333",
                padding: 8,
                borderRadius: 6,
                width: 480,
                maxWidth: "90vw",
                margin: "0 auto",
                background: "#0f0f0f",
              }}
            >
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className="the-vaporwave-button2"
                  style={{ textAlign: "left" }}
                >
                  <div>Session: {s.id.slice(0, 8)}…</div>
                  <div>Bot/Challenge: {s.bot_id ?? "-"}</div>
                  <div>Started: {fmt(s.started_at)}</div>
                  {s.ended_at && <div>Ended: {fmt(s.ended_at)}</div>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Thread view (narrower + bigger text) */}
      {selectedSessionId && (
        <div style={{ display: "grid", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button className="the-vaporwave-button2" onClick={handlePrint}>
              Print
            </button>
            <button
              className="the-vaporwave-button2"
              onClick={handleDownloadPdf}
            >
              Download PDF
            </button>
          </div>

          <div
            ref={threadRef}
            style={{
              border: "1px solid #333",
              borderRadius: 12,
              padding: 16,
              maxHeight: 520,
              overflowY: "auto",
              background: "#0a0a0a",
              width: 720,
              maxWidth: "90vw",
              marginTop: 12,
            }}
          >
            {loadingMessages ? (
              <div style={{ color: "#aaa", textAlign: "center" }}>
                Loading messages…
              </div>
            ) : messages.length === 0 ? (
              <div style={{ color: "#aaa", textAlign: "center" }}>
                No messages.
              </div>
            ) : (
              <Thread messages={messages} />
            )}
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: "tomato", textAlign: "center" }}>{error}</div>
      )}
    </div>
  );
}

function Thread({ messages }) {
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
