'use server'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import { GameDetails } from "../types/GameDetails";
import GamePlayerContainer from "./GamePlayerContainer";
// import GameCarouselItems from "./GameCarouselItems"
import { getGames } from "../actions/GetGames"
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

const billiards_metadata = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/games/2_billiards-2-play`)
.then((response) => {
    console.log("SHOW RESPONSE BODY", response);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})

const billiards_game: GameDetails = {
    title: billiards_metadata.metadata.title as unknown as string,
    description: billiards_metadata.metadata.description as unknown as string,
    previewImage: `${process.env.NEXT_PUBLIC_API_URL}/v1/games/2_billiards-2-play/preview`,
    file: `${process.env.NEXT_PUBLIC_API_URL}/v1/games/2_billiards-2-play/swf`
    // file: `https://api.cors.lol/?url=https://archive.org/download/homerun_20201126/homerun.swf`
};

// initialGames with GetGames.tsx

const initialGames = await getGames();

export default function GameFeed() {

    console.log("GAME FEED")
    console.log(billiards_game)
//   const initialGames = await getGames(preferences);

    return (
        <div className="game-feed">
            <Carousel>
                <CarouselContent>
                    {initialGames.map((game: GameDetails, index: number) => (
                    <CarouselItem key={index}>
                        <GamePlayerContainer game={game} />
                    </CarouselItem>
                    ))}
                    {/* 
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
                    */}
                </CarouselContent>
            </Carousel>
        </div>
    )         
    }
