import { useState } from "react";
import { signOut } from "../initialpageCompontents/InitialApi";

export default function LoginForm({ setIsLoggedIn }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!anon) {
        console.error("Missing VITE_SUPABASE_ANON_KEY");
        setMessage("Client misconfig: missing anon key");
        return;
      }

      const res = await fetch(
        "https://yqroigcevcoddsmangyg.functions.supabase.co/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anon}`,
            apikey: anon,
          },
          body: JSON.stringify({ name, password }),
        }
      );
      console.log(name, password);
      console.log("efter res");

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      // Save token in sessionStorage
      sessionStorage.setItem("token", data.token);

      // mark admin as logged in
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error during login");
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
        // className="vaporwave-input"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          padding: "24px",
          borderRadius: "12px",
          background: "linear-gradient(to right, #ff7e5f, #feb47b)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "300px",
          outline: "none",
        }}
      >
        {/* <h2 style={{ textAlign: "center", margin: 0, paddingBottom: "50px" }}>
          Login
        </h2> */}

        <input
          className="vaporwave-input"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#FFFADE",
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
            background: "#FFFADE",
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
