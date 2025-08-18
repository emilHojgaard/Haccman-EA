import { useState } from "react";

export default function LoginForm({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // LOGIN
  const validUsername = "admin";
  const validPassword = "1234";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === validUsername && password === validPassword) {
      setIsLoggedIn(true);
    } else {
      setMessage("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="vaporwave-input"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          padding: "24px",
          borderRadius: "12px",
          background: "linear-gradient(to right, #ff7e5f, #feb47b)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", margin: 0, paddingBottom: "50px" }}>
          Login
        </h2>

        <input
          className="vaporwave-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <input
          className="vaporwave-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        <button
          className="vaporwave-input"
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "8px",
            background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            color: "black",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Login
        </button>

        {message && (
          <p style={{ textAlign: "center", marginTop: "8px" }}>{message}</p>
        )}
      </form>
    </div>
  );
}
