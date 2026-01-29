'use server'
import { GameDetails } from "../types/GameDetails"
import { Preferences } from "../types/Preferences";

export async function getGames(): Promise<GameDetails[]> {
    const pref: Preferences = {
        Total: 0,
        Arcade: 0,
        Action: 0,
        Puzzle: 0,
        Adventure: 0,
        Sports: 0,
        Dress_up_games: 0,
        Driving: 0,
        Slacking: 0,
        Platformer: 0,
        Simulation: 0
    };

    console.log(JSON.stringify(pref));

    const listResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pref),
    });

    if (!listResp.ok) {
        const text = await listResp.text().catch(() => undefined);
        console.error('Failed to fetch game list:', listResp.status, text);
        throw new Error('Network response was not ok');
    }

    const identifiers = (await listResp.json()) as string[];

    const games = await Promise.all(identifiers.map(async (identifier) => {
        const metaResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/games/${identifier}`);
        if (!metaResp.ok) {
            console.error(`Failed to fetch metadata for ${identifier}:`, metaResp.status);
            throw new Error(`Failed to fetch metadata for ${identifier}`);
        }
        const game_metadata = await metaResp.json();

        const gameDetails: GameDetails = {
            title: game_metadata?.metadata?.title ?? identifier,
            description: game_metadata?.metadata?.description ?? `<p>Description for ${identifier}</p>`,
            previewImage: `${process.env.NEXT_PUBLIC_API_URL}/v1/games/${identifier}/preview`,
            file: `${process.env.NEXT_PUBLIC_API_URL}/v1/games/${identifier}/swf`,
        };

        return gameDetails;
    }));

    return games;
}
