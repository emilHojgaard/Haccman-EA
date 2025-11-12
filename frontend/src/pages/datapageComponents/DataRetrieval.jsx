import { useEffect, useMemo, useRef, useState } from "react";
import {
  getAllUsernames,
  getSessionsByUser,
  loadMessagesAdmin,
} from "../../apiSupabase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Thread from "./smallComponents/Thread";

// small helper
function fmt(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

// NEW: helper to build a filename similar to your PDF naming
function buildTxtFilename(username, sessionId) {
  const user = username ?? "user";
  const sess = sessionId ? sessionId.slice(0, 8) : "session";
  return `conversation_${user}_${sess}.txt`;
}

// NEW: download helper
function downloadBlob(contents, mime, filename) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// NEW: serialize thread to plain text with light formatting
function serializeMessagesAsTxt(messages) {
  const SEP = "\n" + "-".repeat(72) + "\n";
  const lines = [];
  lines.push("Conversation export");
  lines.push(SEP.trim());
  (messages || []).forEach((m) => {
    const time = m.created_at ? new Date(m.created_at).toLocaleString() : "";
    const role = (m.role || m.sender || "unknown").toUpperCase();
    const content =
      typeof m.content === "string"
        ? m.content
        : JSON.stringify(m.content, null, 2);
    lines.push(`[${time}] ${role}`);
    lines.push(content);
    lines.push(SEP);
  });
  return lines.join("\n");
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

  // Full-thread PDF (multi-page) using html2canvas + jsPDF
  async function handleDownloadPdf() {
    if (!threadRef.current) return;
    const el = threadRef.current;

    // Remember what the element actually had inline
    const prev = {
      maxHeight: el.style.maxHeight,
      overflowY: el.style.overflowY,
    };

    // Expand for capture
    el.style.maxHeight = "none";
    el.style.overflowY = "visible";

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollY: -window.scrollY, // avoids offset issues
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
      // Restore exactly what was there (could be empty string)
      el.style.maxHeight = prev.maxHeight;
      el.style.overflowY = prev.overflowY;
    }
  }

  // NEW: Plain text export (keeps light formatting)
  function handleDownloadTxt() {
    try {
      const txt = serializeMessagesAsTxt(messages);
      const filename = buildTxtFilename(
        selectedUser?.username,
        selectedSessionId
      );
      downloadBlob(txt, "text/plain;charset=utf-8", filename);
    } catch (e) {
      setError(e.message || "Failed to generate TXT.");
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Centered pre-search header */}
      <div style={{ textAlign: "center", paddingBottom: "20px" }}>
        <p style={{ margin: "6px 0 12px 0", color: "#FFFADE" }}>
          Pick a user → choose a conversation → read/download
        </p>
      </div>

      {/* Search + dropdown */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "80px",
        }}
      >
        <div
          ref={inputWrapRef}
          style={{ position: "relative", width: 520, maxWidth: "90%" }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <p style={{ color: "#FFFADE", flexShrink: 0 }}>
              {">> Enter a username:"}
            </p>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleOpenDropdown}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #444",
                borderRadius: 6,
                background: "#FFFADE",
                color: "#000",
                outline: "none",
              }}
            />
            <button
              className="the-vaporwave-button2"
              onClick={handleSearchClick}
              style={{
                color: "#FFFADE",
                background: "black",
              }}
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
                background: "#FFFADE",
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

      {/* Div for handling the possitioning of the sessionlist and thread*/}
      <div
        style={
          selectedSessionId && {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }
        }
      >
        {/* Sessions list */}
        <div>
          {selectedUser && (
            <div style={{ display: "grid", justifyContent: "center" }}>
              <div
                style={{
                  marginBottom: 8,
                  textAlign: "center",
                  padding: "10px 10px",
                  color: "#FFFADE",
                  borderRadius: 6,
                }}
              >
                Conversations for <strong>"{selectedUser.username}"</strong>
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
                      style={{ textAlign: "left", background: "#FFFADE" }}
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
        </div>

        <div>
          {/* Thread view  */}
          {selectedSessionId && (
            <div style={{ display: "grid", justifyContent: "center" }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "space-between",
                  padding: "0 12px",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ color: "#FFFADE", flex: 2, paddingTop: 10 }}>
                    Message Thread:
                  </div>
                  <button
                    className="the-vaporwave-button2"
                    onClick={handleDownloadPdf}
                    style={{
                      flex: 1,
                      color: "#FFFADE",
                      background: "black",
                      border: "1px solid #FFFADE",
                      borderRadius: 6,
                      marginRight: 8,
                    }}
                  >
                    Download PDF
                  </button>

                  {/* NEW: TXT button */}
                  <button
                    className="the-vaporwave-button2"
                    onClick={handleDownloadTxt}
                    style={{
                      flex: 1,
                      color: "#FFFADE",
                      background: "black",
                      border: "1px solid #FFFADE",
                      borderRadius: 6,
                    }}
                  >
                    Download .txt
                  </button>
                </div>
              </div>

              <div
                ref={threadRef}
                style={{
                  width: 720,
                  maxWidth: "90vw",
                  marginTop: 12,
                }}
              >
                {loadingMessages ? (
                  <div style={{ color: "#aaa", textAlign: "center" }}>
                    Loading messages…
                  </div>
                ) : (
                  <Thread messages={messages} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ color: "tomato", textAlign: "center" }}>{error}</div>
      )}
    </div>
  );
}
