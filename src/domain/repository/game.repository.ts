import type { GameEntity, GameFormat } from '../entities/index.js'

export interface UpdateGameData {
  title?: string
  platformId?: string
  format?: GameFormat
  releaseYear?: number | null
  edition?: string
  genres?: string[]
  notes?: string
}

export interface GameRepository {
  create (game: GameEntity): Promise<GameEntity>
  update (id: string, data: UpdateGameData): Promise<GameEntity>
  delete (id: string): Promise<void>
  findAll (): Promise<GameEntity[]>
}