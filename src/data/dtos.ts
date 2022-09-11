import { Question } from "./models"

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
    players: PlayerDto[]
}