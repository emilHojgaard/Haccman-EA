import { useNavigate } from "react-router-dom";

export default function Title() {
  const navigate = useNavigate();

  return (
    // <div
    //   className="flex flex-row justify-center bg-black "
    //   // style={{
    //   //   display: "flex",
    //   //   alignItems: "center",
    //   //   justifyContent: "center",
    //   //   position: "relative",
    //   //   background: "linear-gradient(to right, #ff7e5f, #feb47b)",
    //   //   padding: "12px 0",
    //   // }}
    // >
    //   <button
    //     className="vaporwave-input"
    //     onClick={() => navigate(-1)}
    //     style={{
    //       position: "absolute",
    //       left: "16px",
    //       border: "none",
    //       background: "none",
    //       cursor: "pointer",
    //       boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    //     }}
    //   >
    //     Go Back
    //   </button>
    //   <h1 className="text-[#FFFADE] font-arcade">Data Page</h1>
    // </div>

    <div className="h-screen flex items-center justify-center bg-blue-500 text-white text-4xl">
      Tailwind virker!
    </div>
  );
}
