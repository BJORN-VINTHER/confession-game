import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Answer, GameRound, Player } from "../data/models";
import { getGame, getRound, nextRound, playerAnswered } from "../gameManager";

export class SocketConnection {
    ip: string;
    private socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

    constructor(socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, ip: string) {
        this.ip = ip;
        this.socket = socket;

        socket.on("nextRound", args => nextRound(args));
        socket.on("submitAnswer", args => playerAnswered(args.gameId, args.playerIp, args.option));
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