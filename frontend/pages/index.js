// pages/index.js
import Head from 'next/head';
import RuffleLoader from '../components/RuffleLoader';
import GamePlayer from '../components/GamePlayer';
import styles from '../styles/Home.module.css';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const games = [
    {
      id: 1,
      title: "Classic Game 1",
      swfPath: "http://localhost:8080/games/1",
      thumbnail: "/thumbnails/game1.jpg",
      width: 800,
      height: 600
    },

    {
      id: 2,
      title: "Classic Game 2",
      swfPath: "http://localhost:8080/games/1",
      thumbnail: "/thumbnails/game2.jpg",
      width: 800,
      height: 600,
      genres: ["puzzle"]
    },

    {
      id: 3,
      title: "Classic Game 3",
      swfPath: "http://localhost:8080/games/1",
      thumbnail: "/thumbnails/game3.jpg",
      width: 800,
      height: 600,
      genres: ["strategy", "simulation"]
    },
  ];

  // Track play time for each game
  const onPlayTime = (gameId, playTimeMs) => {
    console.log(`Game ${gameId} played for ${playTimeMs} ms`);
    // Find the game and its genres (for now, hardcoded example)
    const game = games[0];
    // const game = games.find(g => g.id === gameId);
    const genres = game.genres || ["platformer"]; // Replace with real genres per game
    setPreferences(prev => {
      console.log('Previous preferences:', prev);
      console.log('Genres for game:', genres);
      const updated = { ...prev };
      genres.forEach(genre => {
        updated[genre] = (updated[genre] || 0) + playTimeMs;
      });
      return updated;
    });
  };  

  const [preferences, setPreferences] = useState({
    platformer: 0,
    action: 0,
    puzzle: 0,
    strategy: 0,
    simulation: 0
  });

  const preferencesRef = useRef(preferences);
  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  const onTerminate = async () => {
    // Use a ref to always get the latest preferences
    const latestPreferences = preferencesRef.current;
    console.log("send", JSON.stringify(latestPreferences));
    await fetch('/api/send-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(latestPreferences),
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Flash Games Archive</title>
        <meta name="description" content="Play  Flash games using Ruffle" />
        {/* Preload Ruffle for better performance */}
        <link rel="preload" href="/ruffle/ruffle.js" as="script" />
        <link rel="preload" href="/ruffle/ruffle.wasm" as="fetch" crossOrigin="anonymous" />
      </Head>

      <RuffleLoader />

      <main className={styles.main}>
        <h1 className={styles.title}>Classic Flash</h1>
        
        <p className={styles.description}>
          Relive your childhood favorites powered by Ruffle
        </p>

        <div className={styles.grid}>
          {games.map((game) => (
            <div key={game.id} className={styles.card}>
              <h3>{game.title}</h3>
              <div className={styles.gameContainer}>
                <GamePlayer
                  swfPath={game.swfPath}
                  width={game.width}
                  height={game.height}
                  gameId={game.id}
                  onPlayTime={onPlayTime}
                  onTerminate={onTerminate}
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>SWF games powered by Ruffle - Flash emulator</p>
      </footer>
    </div>
  );
}