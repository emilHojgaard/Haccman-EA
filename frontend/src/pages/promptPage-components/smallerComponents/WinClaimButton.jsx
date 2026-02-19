import html2canvas from "html2canvas";
import { supabase } from "../../../theLeftoverFiles/supabaseClient";

export default function WinClaimButton({ playSoundEffect }) {
  const handleClick = async () => {
    try {
      playSoundEffect?.("select");

      const node = document.documentElement || document.body;

      const canvas = await html2canvas(node, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 1),
      );

      if (!blob) {
        alert("Screenshot failed. Check console for errors.");
        return;
      }

      //-------- screenshot to Supabase Storage --------
      const fileName = `screenshot_${Date.now()}.png`;

      const { error } = await supabase.storage
        .from("screenshots")
        .upload(fileName, blob, {
          contentType: "image/png",
          upsert: false,
        });

      if (error) throw error;

      alert("Screenshot uploaded!");
    } catch (e) {
      console.error(e);
      alert("Couldn’t take screenshot (likely CORS). See console for details.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        border: "2px solid #ffffff",
        padding: "5px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <button
        id="winClaimButton"
        className="the-vaporwave-button2"
        style={{ width: "100%" }}
        onClick={handleClick}
      >
        I think I won
      </button>
    </div>
  );
}
