import { PlayerDto } from "./data/dtos";
import { Game, Player } from "./data/models";
import { questions } from "./data/questions";
import { SocketConnection } from "./routers/socketConnection";
import { randomNumber } from "./utilities";


const activeGames: { [key: string]: Game } = {};

export function createGame(hostIp: string): Game {
    const game: Game = {
        gameId: randomNumber(100, 1000).toString(),
        hostIp: hostIp,
        players: [],
        timePerRound: 20,
        totalRounds: questions.length - 1,
        currentRound: -1
    };
    activeGames[game.gameId] = game;
    console.log(`Hosting game: ${game.gameId} with host: ${game.hostIp}`);
    return game;
}

export function joinGame(gameId: string, player: Player): void {
    const game = activeGames[gameId];
    const existingPlayer = game.players.find(x => x.ip === player.ip);
    if (existingPlayer) {
        throw Error("Player has already joined the game");
    }
    game.players.push(player);
    console.log(`Player: ${player.ip} joined the game`);
}

export function addConnection(connection: SocketConnection) {
    const game = activeGames[connection.gameId];
    const player = game.players.find(x => x.ip === connection.ip);
    if (!player) {
        throw Error("Player does not exist");
    }
    player.connection = connection;
}

export function getGameState(gameId: string, player: Player): void {
    const game = activeGames[gameId];
    const existingPlayer = game.players.find(x => x.ip === player.ip);
    if (existingPlayer) {
        throw Error("Player has already joined the game");
    }
    game.players.push(player);
    console.log(`Player: ${player.ip} joined the game`);
}