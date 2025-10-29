export default function PageTitleSmall({ title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "20px",
        paddingBottom: "20px",
        color: "#fff",
        border: "2px solid #000000",
        fontSize: "30px",
        fontFamily: "ARCADE_I",
        textShadow: "4px 4px 0px #A9345C",
      }}
    >
      {title}
    </div>
  );
}

//"text-white text-3xl font-arcade border-2 border-black text-shadow-lg py-4 px-6"
