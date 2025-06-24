// pages/index.js
import { useState, useEffect, useRef } from "react";
import GamePlayer from "../components/GamePlayer";

export default function GameScroller() {
  const [games, setGames] = useState(["game1", "game2", "game3"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef(null);

  // Preload next 2 games
  useEffect(() => {
    const preloadGames = async () => {
      for (let i = 1; i <= 2; i++) {
        const nextIndex = currentIndex + i;
        if (nextIndex < games.length) {
          await fetch(`http://localhost:8080/games/${games[nextIndex]}`);
        }
      }
    };
    preloadGames();
  }, [currentIndex, games]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = (e) => {
      const { deltaY } = e;
      if (deltaY > 0 && currentIndex < games.length - 1) {
        // Scroll down: pause current, terminate if 3+ away
        setCurrentIndex((prev) => prev + 1);
        if (currentIndex >= 2) {
          fetch(`http://localhost:8080/terminate/${games[currentIndex - 2]}`);
        }
      } else if (deltaY < 0 && currentIndex > 0) {
        // Scroll up
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [currentIndex, games]);

  return (
    <div ref={scrollerRef}>
      {games.map((gameId, index) => (
        <div key={gameId} style={{ height: "100vh" }}>
          {Math.abs(index - currentIndex) <= 2 ? (
            <GamePlayer
              gameId={gameId}
              isPaused={index !== currentIndex}
              onTerminate={() => {
                if (Math.abs(index - currentIndex) >= 3) {
                  fetch(`http://localhost:8080/terminate/${gameId}`);
                }
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}