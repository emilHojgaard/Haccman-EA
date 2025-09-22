import LeaveButton from "./smallerComponents/LeaveButton";

export default function InfoButtons({ setShowInformation, playSoundEffect }) {
  return (
    <div>
      <p style={{ color: "#fffade" }}> Info</p>

      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <div
          style={{
            display: "inline-block",
            border: "2px solid #fffade",
            padding: "5px",
          }}
        >
          <button
            style={{ width: "100%" }}
            onClick={() => {
              setShowInformation(true);
            }}
          >
            SystemInfo
          </button>
        </div>
        <LeaveButton playSoundEffect={playSoundEffect} />
      </div>
    </div>
  );
}
