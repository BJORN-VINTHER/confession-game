import express from "express";
import bodyParser from "body-parser"
import { createServer } from "http";
import cors from 'cors';
import path from 'path';
import { apiRouter } from './routers/apiRouter';
import { viewRouter } from './routers/viewRouter';
import { Server } from "socket.io";
import { SocketConnection } from "./routers/socketConnection";
import { addConnection } from "./gameManager";


const app = express();
app.use(express.json());
app.use(cors());


// setup default html page
app.set('views', path.join(__dirname, 'static'));
app.set('view engine', 'pug');
app.use('/', viewRouter);

// configure web server
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;
app.set('port', PORT);
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

// setup api routes
app.use(apiRouter);
app.use(cors());

// setup socket
const io = new Server(httpServer, { cors: { origin: '*'} });
io.on("connection", async (socket) => {
    const { gameId, ip } = socket.handshake.query;
    if (gameId && ip) {
        const connection = new SocketConnection(socket, gameId.toString(), ip.toString());
        addConnection(connection);
    }
});