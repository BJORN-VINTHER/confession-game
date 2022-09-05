import { Router } from 'express';
import { Player } from '../data/models';
import { createGame, joinGame } from '../gameManager';
import bodyParser from "body-parser"

export const apiRouter = Router();


// Host a new game
apiRouter.post('/game', (req, res) => {
    const body = req.body;
    // let { ip } = req.body;
    // const game = createGame(ip);
    // res.status(200).send({ gameId: game.gameId});
});

// join a game
apiRouter.get('/game/:gameId/join', (req, res) => {
    try {
        const player:Player = req.body;
        joinGame(req.params.gameId, player);
        res.sendStatus(200);
    } catch(e) {
        res.status(400).send("User has already joined the game");
    }
});

// get game state
apiRouter.get('/game/:gameId/state', (req, res) => {
    const player:Player = req.body;
    joinGame(req.params.gameId, player);
    res.sendStatus(200);
});

// ztest
apiRouter.get('/test', (req, res) => {
    res.send('HTTP response with Hello!');
});