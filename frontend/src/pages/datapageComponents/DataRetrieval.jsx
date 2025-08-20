import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function DataRetrieval() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load usernames on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        // Replace with your API endpoint
        const res = await fetch("/api/users");
        const data = await res.json();
        // Sort alphabetically by username
        const sorted = data.sort((a, b) =>
          a.username.localeCompare(b.username)
        );
        setUsers(sorted);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  // Fetch messages when user is selected
  useEffect(() => {
    if (!selectedUser) return;

    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages/${selectedUser}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMessages();
  }, [selectedUser]);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Messages for ${selectedUser}`, 10, 10);
    let y = 20;
    messages.forEach((msg) => {
      doc.text(`${msg.sender}: ${msg.text}`, 10, y);
      y += 10;
    });
    doc.save(`${selectedUser}-messages.pdf`);
  };

  const handlePrint = () => {
    const printContent =
      document.getElementById("messages-container").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Data Retrieval</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            width: "200px",
            borderRight: "1px solid #ddd",
            paddingRight: "10px",
          }}
        >
          <h4>Users</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredUsers.map((user) => (
              <li
                key={user.username}
                style={{
                  cursor: "pointer",
                  padding: "6px",
                  background:
                    selectedUser === user.username ? "#e0e0e0" : "transparent",
                  borderRadius: "4px",
                  marginBottom: "4px",
                }}
                onClick={() => setSelectedUser(user.username)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          {selectedUser && (
            <>
              <h4>Messages for {selectedUser}</h4>
              <div
                id="messages-container"
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "8px",
                  height: "400px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  background: "#f9f9f9",
                }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      alignSelf:
                        msg.sender === "AI" ? "flex-start" : "flex-end",
                      background: msg.sender === "AI" ? "#d1e7dd" : "#f8d7da",
                      padding: "6px 12px",
                      borderRadius: "12px",
                      maxWidth: "70%",
                    }}
                  >
                    <strong>{msg.sender}</strong>: {msg.text}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={handleDownloadPDF}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  Print
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
