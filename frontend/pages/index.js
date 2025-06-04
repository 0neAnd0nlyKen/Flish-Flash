// pages/index.js
import Head from 'next/head';
import RuffleLoader from '../components/RuffleLoader';
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
      title: "Adventure Game",
      swfPath: "/games/adventure.swf",
      thumbnail: "/thumbnails/adventure.jpg",
      width: 550,
      height: 400
    },
    // Add more games as needed
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Flash Games Archive</title>
        <meta name="description" content="Play classic Flash games using Ruffle" />
        {/* Preload Ruffle for better performance */}
        <link rel="preload" href="/ruffle/ruffle.js" as="script" />
        <link rel="preload" href="/ruffle/ruffle.wasm" as="fetch" crossOrigin="anonymous" />
      </Head>

      <RuffleLoader />

      <main className={styles.main}>
        <h1 className={styles.title}>Classic Flash Games</h1>
        
        <p className={styles.description}>
          Relive your childhood favorites powered by Ruffle
        </p>

        <div className={styles.grid}>
          {games.map((game) => (
            <div key={game.id} className={styles.card}>
              <h3>{game.title}</h3>
              <div className={styles.gameContainer}>
                <embed
                  src={game.swfPath}
                  width={game.width}
                  height={game.height}
                  type="application/x-shockwave-flash"
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