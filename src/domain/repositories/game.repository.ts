import type { GameEntity, GameStatus } from '../entities/index.js'
import type {
  GameLikeUpdateData,
  GameLikeSearchCriteriaData,
  GameLikeFiltersData,
} from '../../domain/types/index.js'

export interface UpdateGameData extends GameLikeUpdateData {
  status?: GameStatus
  completedAt?: Date | null
}

export interface GameFilters extends GameLikeFiltersData {
  status?: GameStatus
  completedAt?: Date | null
}

export interface GameSearchCriteria extends GameLikeSearchCriteriaData {
  platformName?: string
}

export interface GameRespositorySearchCriteria extends GameLikeSearchCriteriaData {
  platformIds?: string[]
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
