import AssetInfo from "../../../AssetInfo";

export default function LLMInfo({ setInfoPanels }) {
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
        <AssetInfo setInfoPanels={setInfoPanels} mainText={"llm"}></AssetInfo>
      </div>
      <div className="beaten-back"></div>
    </div>
  );
}
