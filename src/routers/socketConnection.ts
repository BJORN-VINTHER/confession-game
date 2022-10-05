import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameRound, GameRoundResult, Player } from "../data/models";
import { getNextRound } from "../gameManager";

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
        console.log("Started next round: " + gameId);
        const round = getNextRound(gameId);
        this.notifyRoundStarted(round);
    }

    notifyTestResponse(message: string) {
        this.socket.emit("testResponse", message);
    }

    notifyPlayerJoined(player: Player) {
        this.socket.emit("playerJoined", player);
    }

    notifyRoundStarted(round: GameRound) {
        this.socket.emit("roundStarted", round);
    }

    notifyRoundEnded(round: GameRoundResult) {
        this.socket.emit("roundEnded", round);
    }
}