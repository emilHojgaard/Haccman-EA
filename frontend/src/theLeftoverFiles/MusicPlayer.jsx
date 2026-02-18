// MusicPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useSoundEffect } from "./SoundEffectContext";

const MusicPlayer = () => {
  const { isMuted, setIsMuted } = useSoundEffect();
  const [hidden, setHidden] = useState(false);

  const [currentMusic, setCurrentMusic] = useState("");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const location = useLocation();
  const audioRef = useRef(null);

  useEffect(() => {
    setHidden(false); // reset when changing route
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/play2") return;

    const el = document.querySelector(".background");
    if (!el) return;

    const onScroll = () => setHidden(el.scrollTop > 50);

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const musicFiles = {
    "/": ["/sound/8bit-music-for-game-68698.mp3"],
    "/play": [
      "/sound/pixel-fight-8-bit-arcade-music-background-music-for-video-28-second-208770.mp3",
    ],
    "/play2": [
      "/sound/cyber-sport-aggressive-cyberpunk-196478.mp3",
      "/sound/retro-games-glitch-technology-synthwave-199939.mp3",
    ],
    "/data": "",
  };

  const volumeLevels = {
    "/": 1.0,
    "/play": 0.1,
    "/play2": 0.6,
  };

  useEffect(() => {
    const currentPath = location.pathname;
    setCurrentTrackIndex(0);

    if (musicFiles[currentPath]) {
      setCurrentMusic(musicFiles[currentPath][0]);
    }
  }, [location]);

  useEffect(() => {
    if (audioRef.current?.audio.current) {
      const audio = audioRef.current.audio.current;

      audio.volume = volumeLevels[location.pathname] || 0.5;
      audio.muted = isMuted;
    }
  }, [currentMusic, location.pathname, isMuted]);

  const handleEnded = () => {
    const currentPath = location.pathname;

    if (currentPath === "/" || currentPath === "/play") {
      audioRef.current.audio.current.play();
    } else {
      const tracks = musicFiles[currentPath];
      const nextTrackIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextTrackIndex);
      setCurrentMusic(tracks[nextTrackIndex]);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <button
        onClick={toggleMute}
        className={`mute-button ${hidden ? "hidden" : ""}`}
      >
        {isMuted ? "SOUND OFF" : "SOUND ON"}
      </button>

      {currentMusic && (
        <AudioPlayer
          autoPlay
          src={currentMusic}
          ref={audioRef}
          onEnded={handleEnded}
          showJumpControls={false}
          showSkipControls={false}
          layout="horizontal"
        />
      )}
    </>
  );
};

export default MusicPlayer;
