import { Link } from "react-router-dom";

export default function Title() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "40px",
      }}
    >
      <Link to="/">
        <button
          style={{
            background: "none",
            color: "white",
            border: "none",
            position: "absolute",
            left: "20px",
            top: "20px",
          }}
        >
          Go Back
        </button>
      </Link>

      <div
        style={{
          color: "#FFFADE",
          fontFamily: "ARCADE_I",
          fontSize: 30,
          textShadow: "4px 4px 0px #A9345C",
        }}
      >
        Data Page
      </div>
    </div>
  );
}
