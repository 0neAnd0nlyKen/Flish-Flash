// pages/index.js
import Head from 'next/head';
import RuffleLoader from '../components/RuffleLoader';
import GamePlayer from '../components/GamePlayer';
import styles from '../styles/Home.module.css';

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
      title: "Classic Game 1",
      swfPath: "http://localhost:8080/games/1",
      thumbnail: "/thumbnails/game1.jpg",
      width: 800,
      height: 600
    },    // Add more games as needed
      {
      id: 3,
      title: "Classic Game 1",
      swfPath: "http://localhost:8080/games/1",
      thumbnail: "/thumbnails/game1.jpg",
      width: 800,
      height: 600
    },
  ];

  // Track play time for each game
  const handlePlayTime = (gameId, playTimeMs) => {
    console.log(`Game ${gameId} played for ${playTimeMs} ms`);
    // Here you could update preferences or send to server
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
                  onPlayTime={handlePlayTime}
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