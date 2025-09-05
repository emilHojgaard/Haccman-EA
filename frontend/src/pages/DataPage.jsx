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
    <div className="background">
      <Title />

      {!isLoggedIn && <LoginForm setIsLoggedIn={setIsLoggedIn} />}
      {isLoggedIn && <p>This is the data page content.</p>}
      {isLoggedIn && <DataRetrieval />}
    </div>
  );
}
