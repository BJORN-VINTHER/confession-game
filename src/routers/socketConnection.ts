import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Answer, GameRound, Player } from "../data/models";
import { getGame, getRound, nextRound } from "../gameManager";

export class SocketConnection {
    ip: string;
    private socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

    constructor(socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, ip: string) {
        this.ip = ip;
        this.socket = socket;

        socket.on("test", x => this.onTest(x));
        socket.on("nextRound", x => this.onNextRound(x));
    }

    onTest(msg: string) {
        console.log("recieved test: " + msg);
        this.notifyTestResponse("Sample server response");
    }

    onNextRound(gameId: string) {
        const round = nextRound(gameId);
        console.log(`Started round: ${round.index}`);
        this.notifyRoundStarted(round);
    }

    onSubmitAnswer(gameId: string, playerIp: string, option: number) {
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
            this.notifyPlayerAnswered(answer);
        }
    }

    notifyTestResponse(message: string) {
        this.socket.emit("testResponse", message);
    }

    notifyPlayerJoined(player: Player) {
        this.socket.emit("playerJoined", player);
    }

    notifyPlayerAnswered(answer: Answer) {
        this.socket.emit("playerAnswered", answer);
    }

    notifyRoundStarted(round: GameRound) {
        this.socket.emit("roundStarted", round);
    }

    notifyRoundEnded(round: GameRound) {
        this.socket.emit("roundEnded", round);
    }
}