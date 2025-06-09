'use server'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import GamePlayer from './GamePlayer.js';
// import GameCarouselItems from "./GameCarouselItems"
// import { getGames } from "../actions/GetGames"
// import { GamePreferences } from "../types/GamePreferences"

//make preferences object
// const preferences: GamePreferences = {
//     userId: 'defaultUser',
//     genres: [],
//     playTime: [],
// }

export default function GameFeed() {
//   const initialGames = await getGames(preferences);

  return (
    <div className="game-feed">
      <Carousel>
        <CarouselContent>
            <CarouselItem key={1}>
                <GamePlayer swfPath={"http://localhost:8080/games/1"}>

                </GamePlayer>
            </CarouselItem>

        </CarouselContent>
        {/* <GameCarouselItems initialGames={initialGames}/> */}
      </Carousel>
    </div>
  )
}