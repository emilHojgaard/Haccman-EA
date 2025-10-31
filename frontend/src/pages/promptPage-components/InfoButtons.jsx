import LeaveButton from "./smallerComponents/LeaveButton";

export default function InfoButtons({ setShowInformation, playSoundEffect }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          // gap: "150px",
          gap: "25px",
          marginRight: "-50px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            border: "2px solid #fffade",
            padding: "5px",
            // width: "150px", // fast bredde
            // height: "50px", // fast højde
          }}
        >
          <button
            style={{ width: "100%", height: "100%" }}
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
