// SoundEffectContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const SoundEffectContext = createContext();

const GAIN = { select: 0.3, navigate: 1.0, keystroke: 0.2, win: 2.0 };

export const SoundEffectProvider = ({ children }) => {
  const [audioContext, setAudioContext] = useState(null);
  const [soundEffects, setSoundEffects] = useState({});
  const [gainNodes, setGainNodes] = useState({});

  useEffect(() => {
    const initAudio = async () => {
      try {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        const context = new Ctor();
        setAudioContext(context);

        const loadSound = async (url) => {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          // use the *same* context that was created above
          return new Promise((resolve, reject) => {
            context.decodeAudioData(arrayBuffer, resolve, reject);
          });
        };

        const sounds = await Promise.all([
          loadSound("/sound/8-bit-game-7-188104.mp3"), // select
          loadSound("/sound/8-bit-game-2-186976.mp3"), // navigate
          loadSound("/sound/game-ui-sounds-14857.wav"), // keystroke
          loadSound("/sound/success-fanfare-trumpets-6185.mp3"), // win
        ]);

        setSoundEffects({
          select: sounds[0],
          navigate: sounds[1],
          keystroke: sounds[2],
          win: sounds[3],
        });

        // build gain nodes on this exact context
        const newGainNodes = {};
        for (const key of Object.keys(GAIN)) {
          const g = context.createGain();
          g.gain.value = GAIN[key];
          g.connect(context.destination);
          newGainNodes[key] = g;
        }
        setGainNodes(newGainNodes);

        // unlock/resume on first user gesture
        const unlock = async () => {
          try {
            await context.resume();
          } catch {}
          window.removeEventListener("click", unlock);
          window.removeEventListener("keydown", unlock);
          window.removeEventListener("touchend", unlock);
        };
        window.addEventListener("click", unlock);
        window.addEventListener("keydown", unlock);
        window.addEventListener("touchend", unlock);
        return () => {
          window.removeEventListener("click", unlock);
          window.removeEventListener("keydown", unlock);
          window.removeEventListener("touchend", unlock);
        };
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };

    initAudio();
  }, []);

  const playSoundEffect = async (type) => {
    const ctx = audioContext;
    if (!ctx || !soundEffects[type]) return;

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Ensure we never connect nodes from a different context
      let gain = gainNodes[type];
      if (!gain || gain.context !== ctx) {
        // rebuild this gain node on the current context
        const g = ctx.createGain();
        g.gain.value = GAIN[type] ?? 1;
        g.connect(ctx.destination);
        setGainNodes((prev) => ({ ...prev, [type]: g }));
        gain = g;
      }

      const src = ctx.createBufferSource();
      src.buffer = soundEffects[type];
      src.connect(gain);
      src.start(0);

      src.onended = () => {
        try {
          src.disconnect();
        } catch {}
      };
    } catch (e) {
      console.warn("playSoundEffect failed:", e);
    }
  };

  // (optional) if you keep this, make sure it uses the same `audioContext` as initAudio did
  const preloadSoundEffect = async (url) => {
    if (!audioContext) return null;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, resolve, reject);
      });
    } catch (error) {
      console.error("Error preloading sound effect:", error);
      return null;
    }
  };

  return (
    <SoundEffectContext.Provider
      value={{ playSoundEffect, preloadSoundEffect }}
    >
      {children}
    </SoundEffectContext.Provider>
  );
};

export const useSoundEffect = () => useContext(SoundEffectContext);
