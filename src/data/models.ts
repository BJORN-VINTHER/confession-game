import { SocketConnection } from "../routers/socketConnection"

export interface Game {
    gameId: string,
    hostIp: string,
    players: Player[],
    totalRounds: number,
    timePerRound: number,
    currentRound: number
}

export interface GameRound {
    index: number,
    master: Player,
    question: Question,
    answers: Answer[],
}

export interface Answer {
    player: Player,
    option: number
}

export interface Player {
    ip: string,
    name: string,
    gifUrl: string,
    score: number,
    connection: SocketConnection
}

export interface Question {
    text: string,
    options: string[],
}