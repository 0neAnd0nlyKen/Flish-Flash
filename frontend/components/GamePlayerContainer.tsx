'use server'

import { GameDetails } from "../types/GameDetails";
import GamePlayer from "./GamePlayer";
import styles from "./GamePlayerContainer.module.css";

export default function GamePlayerContainer({ game }: { game: GameDetails }) {
    return(
        <div className={styles.container}>
            <div className={styles.left}>
                <h1>{game.title}</h1>
                <img src={game.previewImage} alt={game.title} className={styles.previewImage} />
            </div>
            <div className={styles.middle}>
                <div className={styles.ruffle}>
                    <GamePlayer swfPath={game.file} />
                </div>
            </div>
            <div className={styles.right}>
                <div dangerouslySetInnerHTML={{ __html: game.description }} />
            </div>
        </div>
    )
}