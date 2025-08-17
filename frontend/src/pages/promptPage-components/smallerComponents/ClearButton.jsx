import { useSoundEffect } from "../../../theLeftoverFiles/SoundEffectContext";

export default function ClearButton({ onClear }) {
  const { playSoundEffect } = useSoundEffect();

  const handleClick = () => {
    playSoundEffect?.("select"); // Optional sound
    onClear?.(); // Clear callback
  };

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
        onClick={handleClick}
      >
        Clear (Tab)
      </button>
    </div>
  );
}
