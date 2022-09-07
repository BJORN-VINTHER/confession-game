import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class SocketConnection {
    ip: string;
    gameId: string;
    socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

    constructor(socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, gameId: string, ip: string) {
        this.ip = ip;
        this.gameId = gameId;
        this.socket = socket;

        socket.on("test", x => this.test(x));
    }

    test(msg: string) {
        console.log("recieved test: " + msg);
        this.testResponse("Sample server response");
    }

    testResponse(message: string) {
        this.socket.emit("testResponse", message);
    }
}