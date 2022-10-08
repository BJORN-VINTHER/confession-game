import { testPlayers } from "./data/testData";
import { getGame, joinGame, nextRound, playerAnswered } from "./gameManager";

export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

export async function simulateLobby(gameId: string) {
    for (const player of testPlayers) {
        await sleep(randomNumber(300, 1500));
        joinGame(gameId, player);
    }
}

export async function simulateRound(gameId: string) {
  const game = getGame(gameId);
  nextRound(game.gameId);
  for (const player of game.players) {
      const option = randomNumber(0, 4);
      playerAnswered(game.gameId, player.ip, option);   
  }
}