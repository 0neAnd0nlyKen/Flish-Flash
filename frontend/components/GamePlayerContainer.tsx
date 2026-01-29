'use server'
import "@picocss/pico/css/pico.min.css";

import { GameDetails } from "../types/GameDetails";
import GamePlayer from "./GamePlayer";
import styles from "./GamePlayerContainer.module.css";

export default function GamePlayerContainer({ game }: { game: GameDetails }) {
    return(
        <div className={`${styles.container} container`}>
            <div className={styles.left}>
                <h2>{game.title}</h2>
                <figure>
                  <img src={game.previewImage} alt={game.title} className={styles.previewImage} />
                </figure>
            </div>
            <div className={styles.middle}>
                <div className={styles.ruffle}>
                    <GamePlayer swfPath={game.file} />
                </div>
            </div>
            <div className={`${styles.right} flow`}>
                <div dangerouslySetInnerHTML={{ __html: game.description }} />
            </div>
        </div>
    )
}