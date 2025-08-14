import AssetInfo from "../../../AssetInfo";

export default function GuardrailInfo({
  setSpecificOn,
  setUserpromptInfo,
  setGuardarailInfo,
  setLLMInfo,
  setSystemInfo,
}) {
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
          setSpecificOn={setSpecificOn}
          setUserpromptInfo={setUserpromptInfo}
          setGuardarailInfo={setGuardarailInfo}
          setLLMInfo={setLLMInfo}
          setSystemInfo={setSystemInfo}
          mainText={"guardrail"}
        ></AssetInfo>
      </div>
      <div className="beaten-back"></div>
    </div>
  );
}
