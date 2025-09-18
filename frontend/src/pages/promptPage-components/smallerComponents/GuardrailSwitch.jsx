import AssetInfo from "../../../theLeftoverFiles/AssetInfo";

export default function GuardrailSwitch({ setInfoPanels }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        justifyContent: "center",
      }}
    >
      <div className="beaten">
        <AssetInfo
          setInfoPanels={setInfoPanels}
          mainText={"guardrail"}
        ></AssetInfo>
      </div>
      <div className="beaten-back"></div>
    </div>
  );
}
