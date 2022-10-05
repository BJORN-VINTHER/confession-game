import { testPlayers } from "./data/testData";
import { joinGame } from "./gameManager";

export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

export async function simulateLobby(gameId: string, startGame: boolean) {
    for (const player of testPlayers) {
        await sleep(randomNumber(300, 1500));
        joinGame(gameId, player);
    }
}