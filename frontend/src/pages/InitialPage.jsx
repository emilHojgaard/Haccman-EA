// src/pages/InitialPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSoundEffect } from "../theLeftoverFiles/SoundEffectContext";
import { useInitialController } from "./initialpageCompontents/InitialFunction.jsx";

const STEPS = ["username", "age", "gender", "familiarity"];

export default function Initial() {
  const {
    stage,
    existingName,
    step,
    busy,
    error,
    form,
    isUsernameValid,
    isAgeValid,
    ageError,
    setStep,
    onUsernameChange,
    onAgeChange,
    onGenderChange,
    onFamiliarityChange,
    handleContinueAsCurrent,
    handlePlayAsSomeoneElse,
    handleContinue,
    nextOrSubmit,
  } = useInitialController();

  const { playSoundEffect } = useSoundEffect();

  // Optional: global Enter/Escape for the form experience
  useEffect(() => {
    const onKey = (e) => {
      if (stage !== "form") return;
      if (e.key === "Enter") {
        playSoundEffect("navigate");
        nextOrSubmit();
      }
      if (e.key === "Escape") setStep(0);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, nextOrSubmit, setStep, playSoundEffect]);

  return (
    <div className="background">
      <Link to="/data">
        <button
          style={{ background: "black", color: "white" }}
          className="datapage-button"
        >
          Data
        </button>
      </Link>

      <img src="/Sticker graphic 1.png" alt="Custom Image" className="logo" />
      <HeaderLine />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4vh",
          marginTop: "1vh",
        }}
      >
        {stage === "loading" && <div style={{ color: "#fff" }}>Loading…</div>}

        {stage === "gate" && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={handleContinueAsCurrent}>
              Play as {existingName}
            </button>
            <button
              onClick={handlePlayAsSomeoneElse}
              disabled={busy !== "none"}
            >
              {busy === "switch" ? "Preparing…" : "Play as someone else"}
            </button>
          </div>
        )}

        {stage === "form" && (
          <>
            {STEPS[step] === "username" && (
              <StepBlock title=">> Enter a username">
                <input
                  autoFocus
                  id="nameInput"
                  value={form.username}
                  onChange={onUsernameChange}
                  className="vaporwave-input"
                  maxLength={6}
                />
              </StepBlock>
            )}

            {STEPS[step] === "age" && (
              <StepBlock title=">> Enter your age">
                <input
                  autoFocus
                  id="ageInput"
                  value={form.age}
                  onChange={onAgeChange}
                  className="vaporwave-input2"
                />
                {form.age && !isAgeValid && (
                  <div style={{ color: "red" }}>{ageError}</div>
                )}
              </StepBlock>
            )}

            {STEPS[step] === "gender" && (
              <StepBlock title=">> The gender you identify with">
                <div id="boxes" className="checkbox_gender">
                  <label htmlFor="female">
                    <input
                      autoFocus
                      type="radio"
                      id="female"
                      name="gender"
                      value="Female"
                      checked={form.gender === "Female"}
                      onChange={onGenderChange}
                    />{" "}
                    Female
                  </label>
                  <label htmlFor="male" style={{ marginLeft: 12 }}>
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="Male"
                      checked={form.gender === "Male"}
                      onChange={onGenderChange}
                    />{" "}
                    Male
                  </label>
                  <label htmlFor="other" style={{ marginLeft: 12 }}>
                    <input
                      type="radio"
                      id="other"
                      name="gender"
                      value="Other"
                      checked={form.gender === "Other"}
                      onChange={onGenderChange}
                    />{" "}
                    Non-binary/Other
                  </label>
                </div>
              </StepBlock>
            )}

            {STEPS[step] === "familiarity" && (
              <>
                <StepBlock title=">> How would you rate your hacking/jailbreaking knowledge?">
                  <div className="checkbox_gender">
                    <label htmlFor="beginner">
                      <input
                        autoFocus
                        type="radio"
                        id="beginner"
                        name="familiarity"
                        value="Beginner"
                        checked={form.familiarity === "Beginner"}
                        onChange={onFamiliarityChange}
                      />{" "}
                      Beginner
                    </label>
                    <label htmlFor="familiar" style={{ marginLeft: 12 }}>
                      <input
                        type="radio"
                        id="familiar"
                        name="familiarity"
                        value="Familiar"
                        checked={form.familiarity === "Familiar"}
                        onChange={onFamiliarityChange}
                      />{" "}
                      Familiar
                    </label>
                    <label htmlFor="advanced" style={{ marginLeft: 12 }}>
                      <input
                        type="radio"
                        id="advanced"
                        name="familiarity"
                        value="Advanced"
                        checked={form.familiarity === "Advanced"}
                        onChange={onFamiliarityChange}
                      />{" "}
                      Advanced
                    </label>
                  </div>
                </StepBlock>

                <div style={{ paddingTop: 20 }}>
                  {isUsernameValid && isAgeValid && (
                    <button
                      id="toplay"
                      className="vaporwave-button"
                      style={{ fontSize: 60, fontFamily: "ARCADE_I" }}
                      onClick={handleContinue}
                      disabled={busy !== "none"}
                    >
                      {busy === "save"
                        ? "Entering…"
                        : "Press Enter to Access Game"}
                    </button>
                  )}
                  {error && (
                    <div style={{ color: "red", marginTop: 8 }}>{error}</div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <ConsentNote />
      </div>
    </div>
  );
}

function HeaderLine() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        color: "#FFFADE",
        fontFamily: "ARCADE_I",
        fontSize: 30,
        textShadow: "4px 4px 0px #A9345C",
      }}
    >
      {"An Arcade Game for Jailbreaking LLMs"}
    </div>
  );
}

function StepBlock({ title, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#FFFFFF",
        gap: "1vh",
      }}
    >
      <div>{title}</div>
      {children}
    </div>
  );
}

function ConsentNote() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#FFFFFF",
        fontSize: 14,
        marginBottom: 20,
        paddingTop: 20,
      }}
    >
      {
        ">>By playing this game, you accept that the info you have entered on this page and your interactions with the LLM (text and time stamps) will be saved on our server and analysed for future research purposes."
      }
    </div>
  );
}
