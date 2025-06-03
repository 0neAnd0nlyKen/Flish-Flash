// components/GamePlayer.js
import { useEffect, useRef, useState } from "react";

export default function GamePlayer({ gameId, onTerminate }) {
  const playerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Load Ruffle (Flash emulator)
    const loadRuffle = async () => {
      if (!window.RufflePlayer) {
        const script = document.createElement("script");
        script.src = "C:\\code\\go-nextjs\\frontend\\node_modules\\@ruffle-rs\\ruffle\\ruffle.js";
        script.async = true;
        script.onload = () => {
          if (window.RufflePlayer) {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            playerRef.current = player;
            document.getElementById(`game-${gameId}`).appendChild(player);
            player.load(`http://localhost:8080/games/${1}`);
          }
        };
        document.body.appendChild(script);
      } else {
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        playerRef.current = player;
        document.getElementById(`game-${gameId}`).appendChild(player);
        player.load(`http://localhost:8080/games/${1}`);
      }
    };

    loadRuffle();

    return () => {
      // Cleanup when unmounted
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, [gameId]);

  // Pause/resume on visibility change
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPaused) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  }, [isPaused]);

  return <div id={`game-${gameId}`} />;
}