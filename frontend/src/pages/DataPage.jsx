import DataRetrieval from "./datapageComponents/DataRetrieval";
import LoginForm from "./datapageComponents/LoginForm";
import Title from "./datapageComponents/Title";
import { useState, useEffect } from "react";

export default function DataPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(false);
    const handleBeforeUnload = () => {
      setIsLoggedIn(false);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <Title />

      {!isLoggedIn && <LoginForm setIsLoggedIn={setIsLoggedIn} />}
      {isLoggedIn && <DataRetrieval />}
    </div>
  );
}
