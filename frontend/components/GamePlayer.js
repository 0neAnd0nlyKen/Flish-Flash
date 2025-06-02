// components/GamePlayer.js
import { useEffect, useRef, useState } from "react";

export default function GamePlayer({ gameId, onTerminate }) {
  const playerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Load Ruffle (Flash emulator)
    const loadRuffle = async () => {
      const Ruffle = (await import("ruffle-core")).default;
      const player = Ruffle.newest().createPlayer();
      playerRef.current = player;
      document.getElementById(`game-${gameId}`).appendChild(player);
      await player.load(`http://localhost:8080/games/${gameId}`);
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