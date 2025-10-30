import opponent2 from "../../../assets/avatar2.png";
import opponent3 from "../../../assets/avatar3.png";
import opponent6 from "../../../assets/avatar6.png";
import opponent41 from "../../../assets/avatar41.png";
import opponent42 from "../../../assets/avatar42.png";
import opponent43 from "../../../assets/avatar43.png";

export default function ShowOpponent({ botList, selectedBot }) {
  const bot = botList.find((b) => b.number === selectedBot);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "2px solid #fffffff",
          background: "#000000",
          width: "400px",
          color: "#ffffff",
          gap: "2vh",
        }}
      >
      
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
            fontSize: "20px",
            color: "#000000",
            background: "#F5EB1D",
          }}
        >
          {bot.name}
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            {bot.number === 0 ? (
              <img src={opponent43} width={"140px"}></img>
            ) : bot.number === 1 ? (
              <img src={opponent41} width={"140px"}></img>
            ) : bot.number === 2 ? (
              <img src={opponent42} width={"140px"}></img>
            ) : bot.number === 3 ? (
              <img src={opponent2} width={"140px"}></img>
            ) : bot.number === 4 ? (
              <img src={opponent3} width={"140px"}></img>
            ) : bot.number === 5 ? (
              <img src={opponent6} width={"140px"}></img>
            ) : bot.number === 6 ? (
              <img src={opponent3} width={"140px"}></img>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              padding: "2px",
              fontSize: "15px",
              color: "#FFFADE",
            }}
          >
            {bot.inGameDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
