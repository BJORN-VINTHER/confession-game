import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class SocketConnection {
    ip: string;
    gameId: string;

    constructor(socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, gameId: string, ip: string) {
        this.ip = ip;
        this.gameId = gameId;

        socket.on("test", this.test);
    }

    test(msg:string) {
        console.log("recieved test: " + msg);
    }
}