export default function PageTitle({ selectedTask }) {
  const title = selectedTask?.task ? selectedTask.task.toUpperCase() : "…";
  return (
    <div
      id="llm-box"
      style={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        marginLeft: "40px",
        marginRight: "40px",
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "50px",
        }}
      >
        <div
          style={{
            color: "#FFFADE",
            fontSize: "15px",
            width: "60%",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#FFFADE",
            fontSize: "20px",
            marginBottom: "-5px",
            padding: "10px",
          }}
        >
          {"PLAYING:"}
        </div>
      </div>
    </div>
  );
}
