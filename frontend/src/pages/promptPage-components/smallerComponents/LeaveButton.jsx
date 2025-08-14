import { Link } from "react-router-dom";

export default function LeaveButton({ playSoundEffect }) {
  return (
    <div
      style={{
        display: "flex",
        border: "2px solid #ffffff",
        padding: "5px",
      }}
    >
      <Link to="/play">
        <button
          id="leaveButton"
          onClick={() => {
            playSoundEffect("select"); // Play sound effect
          }}
        >
          Leave fight (Esc)
        </button>
      </Link>
    </div>
  );
}
