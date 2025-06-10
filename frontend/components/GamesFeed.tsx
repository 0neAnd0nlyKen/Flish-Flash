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
      <Carousel>
        <CarouselContent>
            <CarouselItem key={1}>
                <GamePlayer swfPath={initialGames[0].file} />
            </CarouselItem>

        </CarouselContent>
        {/* <GameCarouselItems initialGames={initialGames}/> */}
      </Carousel>
    </div>
  )
}