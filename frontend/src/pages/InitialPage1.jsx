import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSoundEffect } from "../theLeftoverFiles/SoundEffectContext";
import { supabase } from "../theLeftoverFiles/SupabaseClient.jsx";

function Initial(props) {
  // Initialize state for the input values
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [familiarity, setFamiliarity] = useState("");
  const [ready, setReady] = useState(false);
  const { playSoundEffect } = useSoundEffect();
  const [ageError, setAgeError] = useState("");
  //SUPABASE: new states...
  const [hasUser, setHasUser] = useState(false);
  const [nameFromProfile, setNameFromProfile] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const navigate = useNavigate();

  //SUPABASE: checks if user is authenticated and has a profile
  useEffect(() => {
    (async () => {
      // auth is already ensured by App.jsx
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      // If the player already has a name, skip this screen
      if (profile?.username) {
        setHasUser(true);
        setNameFromProfile(profile.full_name);
      }
    })();
  }, [navigate]);

  //SUPABASE: handles the continue button click
  async function handleContinue() {
    if (!ready) return;
    try {
      setSaving(true);
      setSaveError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSaveError("No user session found.");
        setSaving(false);
        return;
      }

      const payload = {
        id: user.id,
        username: username.trim(),
        age: age ? Number(age) : null,
        gender: gender || null,
        familiarity: familiarity || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;

      // if you also keep local state via props:
      props.setName?.(input1Value);
      props.setAge?.(input2Value);
      props.setGender?.(gender);
      props.setFamiliarity?.(familiarity);

      navigate("/play");
    } catch (e) {
      setSaveError(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  //ref for the input
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if the username field is empty
    if (username.trim() === "") {
      setReady(false);
    } else {
      // Check if the age field is either empty or a valid number between 8 and 120
      if (age === "" || (!isNaN(age) && age >= 8 && age <= 120)) {
        setAgeError("");
        setReady(true);
      } else {
        setAgeError("Please enter a number between 8 and 120");
        setReady(false);
      }
    }
  }, [username, age]);

  // Event handler to update the input value when it changes
  const handle1Change = (event) => {
    const value = event.target.value;
    if (value.length <= 6) {
      setUsername(value);
    }
  };

  // Event handler to update the age input value and validate it
  const handle2Change = (event) => {
    const value = event.target.value;
    setAge(value);

    if (value === "" || (!isNaN(value) && value >= 8 && value <= 120)) {
      setAgeError("");
    } else {
      setAgeError("Please enter a number between 8 and 120");
    }
  };

  // Event handler for gender selection
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  // Event handler for familiarity selection
  const handleFamiliarityChange = (event) => {
    setFamiliarity(event.target.value);
  };

  const [moveCounter, setMoveCounter] = useState(0);
  //when mounting add a listener to enter game with enter
  //handle down key and such

  useEffect(() => {
    //focus on the input

    const handleKeyPress = (event) => {
      // Check if the key pressed is Enter (key code 13) and form is ready
      if (event.keyCode === 13 && ready && moveCounter === 3) {
        playSoundEffect("select");
        event.stopPropagation();
        handleContinue();
      }

      if (event.keyCode === 13 && ready) {
        // Down arrow key
        playSoundEffect("navigate");

        /* // Find the currently focused element
                const focusedElement = document.activeElement;

                // Find all focusable elements in the document
                const focusableElements = document.querySelectorAll('input');

                // Find the index of the currently focused element in the focusable elements list
                const currentIndex = Array.from(focusableElements).indexOf(focusedElement);

                // Calculate the index of the next element to focus on
                const nextIndex = (currentIndex + 1) % focusableElements.length;

                // Focus on the next element
                focusableElements[nextIndex].focus(); */

        setMoveCounter(moveCounter + 1);
        console.log(moveCounter, "mv");
      }
    };

    // Add event listener for key press
    document.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [ready, moveCounter]);

  return (
    <div className="background">
      <Link to="/data">
        <button className="datapage-button">Data</button>
      </Link>

      <img
        src="/Sticker graphic 1.png"
        alt="Custom Image"
        className="logo"
      ></img>
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4vh",
          marginTop: "1vh",
        }}
      >
        {hasUser && (
          <button onClick={() => navigate("/play", { replace: true })}>
            Play as {nameFromProfile}
          </button>
        )}

        {moveCounter === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#FFFFFF",
              gap: "1vh",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#FFFFFF",
              }}
            >
              {">> Enter a username"}
            </div>
            <input
              autoFocus
              id="nameInput"
              ref={inputRef}
              value={username}
              onChange={handle1Change}
              className="vaporwave-input"
              maxLength="6"
            />
          </div>
        )}

        {moveCounter === 1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#FFFFFF",
              gap: "1vh",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#FFFFFF",
              }}
            >
              {">> Enter your age"}
            </div>
            <input
              autoFocus
              id="ageInput"
              value={age}
              onChange={handle2Change}
              className="vaporwave-input2"
            />
            {ageError && <div style={{ color: "red" }}>{ageError}</div>}
          </div>
        )}

        {moveCounter === 2 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#FFFFFF",
              }}
            >
              {">> The gender you identify with"}
            </div>
            <div id="boxes" className="checkbox_gender">
              <input
                autoFocus
                type="radio"
                id="female"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={handleGenderChange}
              />
              <label htmlFor="female"> Female</label>
              <input
                type="radio"
                id="male"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={handleGenderChange}
              />
              <label htmlFor="male"> Male</label>
              <input
                type="radio"
                id="other"
                name="gender"
                value="Other"
                checked={gender === "Other"}
                onChange={handleGenderChange}
              />
              <label htmlFor="other"> Non-binary/Other</label>
            </div>
          </div>
        )}

        {moveCounter === 3 && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#FFFFFF",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "#FFFFFF",
                }}
              >
                {">> How would you rate your hacking/jailbreaking knowledge?"}
              </div>
              <div className="checkbox_gender">
                <input
                  autoFocus
                  type="radio"
                  id="beginner"
                  name="familiarity"
                  value="Beginner"
                  checked={familiarity === "Beginner"}
                  onChange={handleFamiliarityChange}
                />
                <label htmlFor="beginner"> Beginner</label>
                <input
                  type="radio"
                  id="familiar"
                  name="familiarity"
                  value="Familiar"
                  checked={familiarity === "Familiar"}
                  onChange={handleFamiliarityChange}
                />
                <label htmlFor="familiar"> Familiar</label>
                <input
                  type="radio"
                  id="advanced"
                  name="familiarity"
                  value="Advanced"
                  checked={familiarity === "Advanced"}
                  onChange={handleFamiliarityChange}
                />
                <label htmlFor="advanced"> Advanced</label>
              </div>
            </div>

            <div style={{ paddingTop: 20 }}>
              {ready && (
                <button
                  id="toplay"
                  className="vaporwave-button"
                  style={{ fontSize: 60, fontFamily: "ARCADE_I" }}
                  onClick={() => {
                    playSoundEffect("select");
                    handleContinue();
                  }}
                  disabled={saving}
                >
                  {saving ? "Entering…" : "Press Enter to Access Game"}
                </button>
              )}
              {saveError && (
                <div style={{ color: "red", marginTop: 8 }}>{saveError}</div>
              )}
            </div>
          </>
        )}

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
      </div>
    </div>
  );
}

export default Initial;
