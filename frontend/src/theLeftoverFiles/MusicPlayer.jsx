// MusicPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const MusicPlayer = () => {
  const [currentMusic, setCurrentMusic] = useState("");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const location = useLocation();
  const audioRef = useRef(null);

  const musicFiles = {
    "/": ["src/assets/8bit-music-for-game-68698.mp3"],
    "/play": [
      "src/assets/pixel-fight-8-bit-arcade-music-background-music-for-video-28-second-208770.mp3",
    ],
    "/play2": [
      "src/assets/cyber-sport-aggressive-cyberpunk-196478.mp3",
      "src/assets/retro-games-glitch-technology-synthwave-199939.mp3",
    ],
    "/data": "",
  };

  const volumeLevels = {
    "/": 1.0, // Volume level for the first track
    "/play": 0.1, // Volume level for the second track
    "/play2": 0.6, // Volume level for the third track
  };

  useEffect(() => {
    const currentPath = location.pathname;
    setCurrentTrackIndex(0); // Reset track index when path changes
    setCurrentMusic(musicFiles[currentPath][0]); // Set the first track for the current path
  }, [location]);

  useEffect(() => {
    if (audioRef.current?.audio.current) {
      audioRef.current.audio.current.volume =
        volumeLevels[location.pathname] || 0.5;
    }
  }, [currentMusic, location.pathname]);

  const handleEnded = () => {
    const currentPath = location.pathname;
    if (currentPath === "/" || currentPath === "/play") {
      // Restart the current track
      setCurrentMusic(musicFiles[currentPath][0]);
      audioRef.current.audio.current.play();
    } else {
      // Move to the next track in the list
      const tracks = musicFiles[currentPath];
      const nextTrackIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextTrackIndex);
      setCurrentMusic(tracks[nextTrackIndex]);
    }
  };

  return (
    currentMusic && (
      <AudioPlayer
        autoPlay
        src={currentMusic}
        ref={audioRef}
        onLoadedMetadata={() => {
          if (audioRef.current?.audio.current) {
            audioRef.current.audio.current.volume =
              volumeLevels[location.pathname] || 0.5;
          }
        }}
        onPlay={() => console.log("Playing music:", currentMusic)}
        onEnded={handleEnded}
      />
    )
  );
};

export default MusicPlayer;
