import AssetInfo from "../../../theLeftoverFiles/AssetInfo";

export default function UserPromptInfo({ setInfoPanels }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="beaten">
        <AssetInfo
          setInfoPanels={setInfoPanels}
          mainText={"userprompt"}
        ></AssetInfo>
      </div>
      <div className="beaten-back"></div>
    </div>
  );
}
