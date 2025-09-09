import opponent2 from "../../../assets/avatar2.png";
import opponent3 from "../../../assets/avatar3.png";
import opponent6 from "../../../assets/avatar6.png";
import opponent41 from "../../../assets/avatar41.png";
import opponent42 from "../../../assets/avatar42.png";
import opponent43 from "../../../assets/avatar43.png";

export default function ShowOpponent({ botList, selectedBot }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "2px solid #fffffff",
          background: "#000000",
          width: "400px",
          padding: "10px",
          color: "#ffffff",
          gap: "2vh",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "2px",
            fontSize: "20px",
            color: "#FFFADE",
          }}
        >
          {" "}
          PLAYING:
        </div>
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
          {botList[selectedBot].is}
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            {botList[selectedBot].number === 0 ? (
              <img src={opponent43} width={"140px"}></img>
            ) : botList[selectedBot].number === 1 ? (
              <img src={opponent41} width={"140px"}></img>
            ) : botList[selectedBot].number === 2 ? (
              <img src={opponent42} width={"140px"}></img>
            ) : botList[selectedBot].number === 3 ? (
              <img src={opponent2} width={"140px"}></img>
            ) : botList[selectedBot].number === 4 ? (
              <img src={opponent3} width={"140px"}></img>
            ) : (
              <img src={opponent6} width={"140px"}></img>
            )}
          </div>

          <div
            style={{
              display: "flex",
              padding: "2px",
              fontSize: "15px",
              color: "#FFFADE",
            }}
          >
            {botList[selectedBot].long_system_description}
          </div>
        </div>
      </div>
    </div>
  );
}
