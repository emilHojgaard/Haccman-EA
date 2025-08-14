import AssetInfo from "../../../AssetInfo";

export default function UserPromptInfo({
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
        alignItems: "center",
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
          mainText={"userprompt"}
        ></AssetInfo>
      </div>
      <div className="beaten-back"></div>
    </div>
  );
}
