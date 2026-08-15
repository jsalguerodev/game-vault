import { GameEntity } from '../../../domain/entities/index.js'
import type {
  GameFilters,
  GameRepository,
} from '../../../domain/repositories/index.js'

interface FilterGamesUseCase {
  execute(filters: GameFilters): Promise<GameEntity[]>
}

export class FilterGames implements FilterGamesUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  public async execute(filters: GameFilters): Promise<GameEntity[]> {
    const hasFilters = Object.values(filters).some(
      (value) => value !== undefined,
    )

    if (!hasFilters) {
      throw new Error('At least one filter must be provided')
    }

    return this.gameRepository.filter(filters)
  }
}
