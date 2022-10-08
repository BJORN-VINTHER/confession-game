import { Answer, Game, GameRound, GameStateDto, Player, PlayerDto } from "./data/models";
import { questions } from "./data/questions";
import { SocketConnection } from "./routers/socketConnection";

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
        timePerRound: 5,
        totalRounds: questions.length - 1,
        currentRound: 0,
        rounds: []
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
    notifyPlayersOfEvent(game, io => io.notifyPlayerJoined(newPlayer));
}

export function getGame(gameId: string): Game {
    const game = activeGames[gameId];
    if (!game) {
        console.log(`Game id = ${gameId} does not exist`)
        throw Error("Game not found");
    }
    return game;
}

export function playerAnswered(gameId: string, playerIp: string, option: number) {
    const game = getGame(gameId);
    const player = game.players.find(x => x.ip === playerIp);
    const round = getRound(gameId);
    const hasAnswered = round.answers.some(x => x.player.ip === playerIp);
    if (hasAnswered) {
        console.log(`${player?.name} has already answered`);
    } else {
        console.log(`${player?.name} answered ${option}`);
        const answer: Answer = {
            player: player!,
            option: option
        };
        round.answers.push(answer);
        notifyPlayersOfEvent(game, io => io.notifyPlayerAnswered(answer));
    }
}

export function nextRound(gameId: string): GameRound {
    const game = getGame(gameId);
    const playerIndex = (game.currentRound + 1) % game.players.length;
    const player = game.players[playerIndex];
    const question = questions[game.currentRound];
    const newRound: GameRound = {
        index: game.currentRound,
        master: player,
        question: question,
        answers: []
    }
    game.rounds.push(newRound);
    console.log("");
    console.log(`--- Started round: ${newRound.index} ---`);
    setTimeout(() => {
        console.log(`--- Ended round: ${newRound.index} ---`);
        notifyPlayersOfEvent(game, x => x.notifyRoundEnded(newRound))
    }, 1000 * game.timePerRound);
    notifyPlayersOfEvent(game, x => x.notifyRoundStarted(newRound))
    return newRound;
}

export function getRound(gameId: string): GameRound {
    const game = getGame(gameId);
    return game.rounds[game.rounds.length - 1];
}

export function getGameState(gameId: string): GameStateDto {
    const game = activeGames[gameId];
    return {
        hostIp: game.hostIp,
        gameId: game.gameId,
        completedRounds: game.currentRound,
        totalRounds: game.totalRounds,
        timePerRound: game.timePerRound,
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

function notifyPlayersOfEvent(game: Game, event: (io: SocketConnection) => void) {
    for (const player of game.players) {
        const io = connections[player.ip];
        if (io) {
            event(io);
        }
    }
}