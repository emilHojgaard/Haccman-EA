// src/hooks/useInitialController.js
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  getProfile,
  signOut,
  signInAnon,
  upsertProfile,
} from "../initialpageCompontents/InitialApi.jsx";

const MAX_NAME_LEN = 6;
const STEPS = ["username", "age", "gender", "familiarity"];

export function useInitialController() {
  const [stage, setStage] = useState("loading"); // 'loading' | 'gate' | 'form'
  const [existingName, setExistingName] = useState("");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState("none"); // 'none' | 'switch' | 'save'
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    age: "",
    gender: "",
    familiarity: "",
  });

  const navigate = useNavigate();

  // Load current user/profile to decide gate vs form
  useEffect(() => {
    let stale = false;
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        if (!stale) setStage("form");
        return;
      }
      const profile = await getProfile(user.id);
      if (stale) return;
      if (profile?.username) {
        setExistingName(profile.username);
        setStage("gate");
      } else {
        setStage("form");
      }
    })().catch((e) => setError(e.message || "Load failed"));
    return () => {
      stale = true;
    };
  }, []);

  // Derived validation (computed, not stored)
  const isUsernameValid =
    form.username.trim().length > 0 && form.username.length <= MAX_NAME_LEN;
  const isAgeValid =
    form.age === "" || (!isNaN(form.age) && +form.age >= 8 && +form.age <= 120);
  const ageError =
    form.age && !isAgeValid ? "Please enter a number between 8 and 120" : "";

  // Handlers (explicit names)
  const onUsernameChange = useCallback((e) => {
    const username = e.target.value;
    if (username.length <= MAX_NAME_LEN) setForm((f) => ({ ...f, username }));
  }, []);

  const onAgeChange = useCallback((e) => {
    const age = e.target.value;
    setForm((f) => ({ ...f, age }));
  }, []);

  const onGenderChange = useCallback((e) => {
    const gender = e.target.value;
    setForm((f) => ({ ...f, gender }));
  }, []);

  const onFamiliarityChange = useCallback((e) => {
    const familiarity = e.target.value;
    setForm((f) => ({ ...f, familiarity }));
  }, []);

  const handleContinueAsCurrent = useCallback(() => {
    navigate("/play", { replace: true });
  }, [navigate]);

  // Gate: sign OUT now; show form; sign IN anon on final continue.
  const handlePlayAsSomeoneElse = useCallback(async () => {
    try {
      setBusy("switch");
      setError("");
      await signOut();
      setStage("form");
      setStep(0);
      setForm({ username: "", age: "", gender: "", familiarity: "" });
    } catch (e) {
      setError(e.message || "Failed to switch user");
    } finally {
      setBusy("none");
    }
  }, []);

  // Final continue: assume no user signed in → sign in anon & save profile
  const handleContinue = useCallback(async () => {
    if (stage !== "form" || !(isUsernameValid && isAgeValid)) return;
    try {
      setBusy("save");
      setError("");
      const user = await signInAnon();
      await upsertProfile(user.id, {
        username: form.username.trim(),
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        familiarity: form.familiarity || null,
      });
      navigate("/play");
    } catch (e) {
      setError(e.message || "Failed to save profile");
    } finally {
      setBusy("none");
    }
  }, [stage, isUsernameValid, isAgeValid, form, navigate]);

  // Step keyboard helper (call from view on keydown if you want global Enter)
  const nextOrSubmit = useCallback(() => {
    if (stage !== "form") return;
    if (isUsernameValid && isAgeValid) {
      if (step === STEPS.length - 1) handleContinue();
      else setStep((s) => s + 1);
    }
  }, [stage, isUsernameValid, isAgeValid, step, handleContinue]);

  return {
    // state
    stage,
    existingName,
    step,
    busy,
    error,
    form,
    isUsernameValid,
    isAgeValid,
    ageError,
    // setters/handlers
    setStep,
    setForm,
    onUsernameChange,
    onAgeChange,
    onGenderChange,
    onFamiliarityChange,
    handleContinueAsCurrent,
    handlePlayAsSomeoneElse,
    handleContinue,
    nextOrSubmit,
  };
}
