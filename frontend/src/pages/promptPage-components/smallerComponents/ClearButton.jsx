import { useSoundEffect } from "../../../theLeftoverFiles/SoundEffectContext";

export default function ClearButton({ handleClear }) {
  return (
    <div
      style={{
        display: "flex",
        border: "2px solid #ffffff",
        padding: "5px",
        width: "10%",
      }}
    >
      <button
        id="clearAllButton"
        className="the-vaporwave-button2"
        onClick={handleClear}
      >
        Clear (Tab)
      </button>
    </div>
  );
}
