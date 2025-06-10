'use server'
import { GameDetails } from "../types/GameDetails"
export async function getGames(): Promise<GameDetails[]> {
    return fetch('http://localhost:8080/games/1'
        // ,{
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ amount }),
        // }
    )
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        return data as GameDetails[];
    })
    .then((data) => {
        return data.map((game: GameDetails) => {
            if (game.file.length > 100) console.log("SWF BASE64");
            const swfBlob = decodeBase64ToSWF(game.file);
            if (swfBlob.length > 100) console.log("SWF BLOB");
            return {
                ...game, // Spread the existing game details
                file: swfBlob, // Assign the decoded SWF blob
            };
        });
    })
    .catch((error) => {
        console.error("Error fetching games:", error);
        throw error; // Re-throw the error to be handled by the caller
    });
}

const decodeBase64ToSWF = (base64: string, contentType: string = '', sliceSize: number = 512) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/x-shockwave-flash" });
    const objectUrl = URL.createObjectURL(blob);    
    return objectUrl; // Return the object URL for the SWF file
}