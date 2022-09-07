import { PlayerDto } from "./data/dtos";
import { Game, Player } from "./data/models";
import { questions } from "./data/questions";
import { SocketConnection } from "./routers/socketConnection";
import { randomNumber } from "./utilities";


const activeGames: { [key: string]: Game } = {
    "1000": {
        gameId: "1000",
        currentRound: 0,
        hostIp: "80.199.160.167",
        players: [],
        totalRounds: 10,
        timePerRound: 5,
    }
};

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

export function joinGame(gameId: string, newPlayer: Player): void {
    const game = activeGames[gameId];
    const existingPlayer = game.players.find(x => x.ip === newPlayer.ip);
    if (existingPlayer) {
        console.log("Player has already joined the game");
        return;
        // throw Error("Player has already joined the game");
    }
    game.players.push(newPlayer);
    console.log(`Player: ${newPlayer.ip} joined the game`);

    // notify player joined
    for (const player of game.players) {
        if (player !== newPlayer && player.connection) {
            player.connection.notifyPlayerJoined(newPlayer);
        }
    }
}

export function addConnection(connection: SocketConnection) {
    const game = activeGames[connection.gameId];
    const player = game.players.find(x => x.ip === connection.ip);
    if (!player) {
        console.log("Player does not exist");
        return;
        // throw Error("Player does not exist");
    }
    player.connection = connection;
}

export function getGameState(gameId: string, player: Player): void {
    // const game = activeGames[gameId];
    // const existingPlayer = game.players.find(x => x.ip === player.ip);
    // if (existingPlayer) {
    //     console.log("Player has already joined the game");
    //     // throw Error("Player has already joined the game");
    // } else {
    //     game.players.push(player);
    //     console.log(`Player: ${player.ip} joined the game`);
    // }
}