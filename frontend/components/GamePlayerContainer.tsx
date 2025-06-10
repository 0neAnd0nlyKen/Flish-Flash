import { GameDetails } from "../types/GameDetails";
import GamePlayer from "./GamePlayer";

export default function GamePlayerContainer({ game }: { game: GameDetails }) {
    return(
        <GamePlayer swfPath={game.file} />
    )
}