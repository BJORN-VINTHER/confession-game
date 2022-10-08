import { Router } from 'express';
import { Player } from '../data/models';
import { createGame, getGameState, joinGame } from '../gameManager';
import bodyParser from "body-parser"
import { simulateLobby, simulateRound } from '../utilities';

export const apiRouter = Router();


// Host a new game
apiRouter.post('/games', (req, res) => {
    try {
        let { ip } = req.body;
        const game = createGame(ip);
        res.status(200).send({ gameId: game.gameId});
    } catch(e) {
        console.error(e, "Failed creating game");
        res.status(500).send("Something failed");
    }
});

// join a game
apiRouter.post('/games/:gameId/join', (req, res) => {
    try {
        const player:Player = req.body;
        joinGame(req.params.gameId, player);
        res.sendStatus(200);
    } catch(e) {
        console.error(e, "Failed joining game");
        res.status(500).send("Something failed");
    }
});

// get game state
apiRouter.get('/games/:gameId/state', (req, res) => {
    try {
        const gameState = getGameState(req.params.gameId);
        res.status(200).send(gameState);
    } catch(e) {
        console.error(e, "Failed getting game state");
        res.status(500).send("Something failed");
    }
});

// simulate the lobby
apiRouter.post('/games/:gameId/simulate-lobby', async (req, res) => {
    try {
        await simulateLobby(req.params.gameId);
        res.sendStatus(200);
    }  catch(e) {
        console.error(e, "Failed simulating game");
        res.status(500).send("Something failed");
    }
});

// simulate a round
apiRouter.post('/games/:gameId/simulate-round', async (req, res) => {
    try {
        await simulateRound(req.params.gameId);
        res.sendStatus(200);
    }  catch(e) {
        console.error(e, "Failed simulating round");
        res.status(500).send("Something failed");
    }
});