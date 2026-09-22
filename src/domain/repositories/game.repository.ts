import type { GameEntity, GameFormat, GameStatus } from '../entities/index.js'

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
  status?: GameStatus
  completedAt?: Date | null
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
  status?: GameStatus
  completedAt?: Date | null
}

export interface GameSearchCriteria {
  title?: string
  platformName?: string
  developer?: string
  publisher?: string
  edition?: string
  genre?: string
  notes?: string
}

export interface GameRespositorySearchCriteria {
  title?: string
  platformIds?: string[]
  developer?: string
  publisher?: string
  edition?: string
  genre?: string
  notes?: string
}

export interface GameRepository {
  create(game: GameEntity): Promise<GameEntity>
  update(id: string, data: UpdateGameData): Promise<GameEntity>
  delete(id: string): Promise<void>
  findAll(): Promise<GameEntity[]>
  filter(filters: GameFilters): Promise<GameEntity[]>
  findById(id: string): Promise<GameEntity>
  search(criteria: GameRespositorySearchCriteria): Promise<GameEntity[]>
  replacePlatformReference(
    currentPlatformId: string,
    newPlatformId: string | null,
  ): Promise<number>
}
