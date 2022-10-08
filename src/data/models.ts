import { SocketConnection } from "../routers/socketConnection"

export interface Game {
    gameId: string,
    hostIp: string,
    players: Player[],
    totalRounds: number,
    timePerRound: number,
    currentRound: number,
    rounds: GameRound[]
}

export interface PlayerDto {
    ip: string,
    name: string,
    gifUrl: string
}

export interface GameStateDto {
    gameId: string,
    hostIp: string,
    completedRounds: number,
    totalRounds: number,
    timePerRound: number,
    players: PlayerDto[]
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
}

export interface Question {
    text: string,
    options: string[],
}