'use server'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { GameDetails } from "../types/GameDetails";
import GamePlayerContainer from "./GamePlayerContainer";
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
// const initialGames = await getGames().then((data) => {
//     console.log("yo INITIAL GAMES", data);
//     return data; // Return the first game for now
// });

// Example GameDetails object with fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/games/2_billiards-2-play/swf`
const billiards_game: GameDetails = {
    file: `${process.env.NEXT_PUBLIC_API_URL}/v1/games/2_billiards-2-play/swf`
};

export default function GameFeed() {
    console.log("GAME FEED")
//   const initialGames = await getGames(preferences);

return (
    <div className="game-feed">
      <Carousel>
        <CarouselContent>
            {/* {initialGames.map((game: GameDetails, index: number) => (
              <CarouselItem key={index}>
                <GamePlayerContainer game={game} />
              </CarouselItem>
            ))} */}
            {/* 10 instance of CarouselItem each containing GamePlayerContainer game={fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/games/2_billiards-2-play/swf`)}*/}
            <CarouselItem key ={1}>
                <GamePlayerContainer game={billiards_game} />
            </CarouselItem>
            <CarouselItem key ={2}>
                <GamePlayerContainer game={billiards_game} />
            </CarouselItem>
            <CarouselItem key ={3}>
                <GamePlayerContainer game={billiards_game} />
            </CarouselItem>
            <CarouselItem key ={4}>
                <GamePlayerContainer game={billiards_game} />
            </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}
