export default function PageTitle({ list_of_challenges, selectedBot }) {
  return (
    <div
      id="llm-box"
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          border: "2px solid #000000",
          background: "#000000",
          color: "#FFFADE",
          padding: "10px",
          fontSize: "35px",
          fontFamily: "ARCADE_I",
          textShadow: "4px 4px 0px #A9345C",
        }}
      >
        {">>>JAILBREAK CHALLENGE: "}
      </div>
      <div style={{ color: "#FFFADE" }}>
        {list_of_challenges[selectedBot].description.toUpperCase()}
      </div>
    </div>
  );
}
