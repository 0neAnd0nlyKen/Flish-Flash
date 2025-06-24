'use server'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import GamePlayer from './GamePlayer.js';
import { getGames } from "../actions/GetGames";
import { GameDetails } from "../types/GameDetails";
import { log } from "console";
import Head from "next/head.js";
import GamePlayerContainer from "./GamePlayerContainer";
import PreferencesProvider from "../context/PreferencesContext";
// import GameCarouselItems from "./GameCarouselItems"
// import { getGames } from "../actions/GetGames"
// import { GamePreferences } from "../types/GamePreferences"

//make preferences object
// const preferences: GamePreferences = {
//     userId: 'defaultUser',
//     genres: [],
//     playTime: [],
// }

//use GetGames
const initialGames = await getGames().then((data) => {
    console.log("yo INITIAL GAMES", data);
    return data; // Return the first game for now
});

export default function GameFeed() {
    console.log("GAME FEED")
//   const initialGames = await getGames(preferences);

return (
    <div className="game-feed">
      <style>
        {`
          .game-feed {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .carousel {
            width: 100%;
            height: 100%;
          }
          .carousel-content {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
          }
          .carousel-item {
            flex-shrink: 0;
            width: 100%;
            height: 100%;
          }
        `}
      </style>
      <Carousel className="carousel">
        <CarouselContent className="carousel-content">
          <PreferencesProvider>
            {initialGames.map((game: GameDetails, index: number) => (
              <CarouselItem key={index} className="carousel-item">
                <GamePlayerContainer game={game} />
              </CarouselItem>
            ))}
          </PreferencesProvider>
        </CarouselContent>
      </Carousel>
    </div>
  )
}


{/* <GameCarouselItems initialGames={initialGames}/> */}
//   <Head>
//     <title>Flash Games Archive</title>

//     <meta name="description" content="Play  Flash games using Ruffle" />More actions

//     {/* Preload Ruffle for better performance */}

//     <link rel="preload" href="/ruffle/ruffle.js" as="script" />

//     <link rel="preload" href="/ruffle/ruffle.wasm" as="fetch" crossOrigin="anonymous" />

//   </Head>
{/* {initialGames.map((game: GameDetails, index: number) => (
  <GamePlayer key={index} swfPath={game.file} />
))} */}
{/* For testing, just show the first game */}
{/* <CarouselItem key={1}>
  <GamePlayer swfPath={initialGames[0].file} />
</CarouselItem>
<CarouselItem key={2}>
  <GamePlayer swfPath={initialGames[1].file} />
</CarouselItem> */}