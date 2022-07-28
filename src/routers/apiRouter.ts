import { Router } from 'express';
import { Player } from '../data/models';
import { createGame, joinGame } from '../gameManager';


const router = Router();

// Host a new game
router.post('/game', (req, res) => {
    let { ip } = req.body;
    const game = createGame(ip);
    res.status(200).send({ gameId: game.gameId});
});

// join a game
router.get('/game/:gameId/join', (req, res) => {
    try {
        const player:Player = req.body;
        joinGame(req.params.gameId, player);
        res.sendStatus(200);
    } catch(e) {
        res.status(400).send("User has already joined the game");
    }
});

// get game state
router.get('/test', (req, res) => {
    res.send('HTTP response with Hello!');
});

module.exports = router;