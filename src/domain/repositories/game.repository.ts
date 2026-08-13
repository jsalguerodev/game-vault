import type { GameEntity, GameFormat } from '../entities/index.js'

export interface UpdateGameData {
  title?: string
  platformId?: string
  format?: GameFormat
  developer?: string
  publisher?: string
  releaseYear?: number | null
  edition?: string
  genres?: string[]
  notes?: string
}

export interface GameFilters {
  title?: string
  platformId?: string
  format?: GameFormat
  developer?: string
  publisher?: string
  releaseYear?: number | null
  edition?: string
  genres?: string[]
}

export interface GameSearchCriteria {

}

export interface GameRepository {
  create(game: GameEntity): Promise<GameEntity>
  update(id: string, data: UpdateGameData): Promise<GameEntity>
  delete(id: string): Promise<void>
  findAll(): Promise<GameEntity[]>
  filter(filters: GameFilters): Promise<GameEntity[]>
  findById(id: string): Promise<GameEntity>
  search(criteria: GameSearchCriteria): Promise<GameEntity[]>
}
