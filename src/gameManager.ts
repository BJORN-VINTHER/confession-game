import { GameStateDto, PlayerDto } from "./data/dtos";
import { Game, Player } from "./data/models";
import { questions } from "./data/questions";
import { SocketConnection } from "./routers/socketConnection";
import { randomNumber } from "./utilities";

const connections: { [ip: string]: SocketConnection } = {};

const activeGames: { [key: string]: Game } = {};

export function addConnection(connection: SocketConnection) {
    connections[connection.ip] = connection;
    console.log(`${connection.ip} connected`);
}

export function createGame(hostIp: string): Game {
    const game: Game = {
        gameId: "999", //randomNumber(100, 1000).toString(),
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
    const game = getGame(gameId);

    const playerExists = game.players.some(x => x.ip === newPlayer.ip);
    if (playerExists) {
        console.log(`Player ${newPlayer.name} (${newPlayer.ip}) has already joined the game`);
        return;
    }

    // notify player joined
    game.players.push(newPlayer);
    console.log(`${newPlayer.name} (${newPlayer.ip}) joined the game`);
    for (const player of game.players) {
        if (player !== newPlayer) {
            const io = connections[player.ip];
            if (io) {
                io.notifyPlayerJoined(newPlayer);
            }
        }
    }
}

function getGame(gameId: string): Game {
    const game = activeGames[gameId];
    if (!game) {
        console.log(`Game id = ${gameId} does not exist`)
        throw Error("Game not found");
    }
    return game;
}

export function getGameState(gameId: string): GameStateDto {
    const game = activeGames[gameId];
    return {
        hostIp: game.hostIp,
        gameId: game.gameId,
        completedRounds: game.currentRound,
        totalRounds: game.totalRounds,
        players: game.players.map(x => {
            const dto: PlayerDto = {
                ip: x.ip,
                name: x.name,
                gifUrl: x.gifUrl
            };
            return dto
        })
    };
}