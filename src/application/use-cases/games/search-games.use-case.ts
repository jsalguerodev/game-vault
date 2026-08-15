import type {
  GameRepository,
  GameSearchCriteria,
  GameRespositorySearchCriteria,
  PlatformRepository,
} from '../../../domain/repositories/index.js'
import { GameEntity } from '../../../domain/entities/index.js'

interface SearchGamesUseCase {
  execute(criteria: GameSearchCriteria): Promise<GameEntity[]>
}

export class SearchGames implements SearchGamesUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly platformRepository: PlatformRepository,
  ) {}
  public async execute(criteria: GameSearchCriteria): Promise<GameEntity[]> {
    let platformIds: string[] = []
    const hasCriteria = Object.values(criteria).some(
      (value) => value !== undefined,
    )

    if (!hasCriteria) {
      throw new Error('Search criteria must be provided')
    }

    if (criteria.platformName) {
      const platforms = await this.platformRepository.search({
        name: criteria.platformName,
      })

      platformIds = platforms.map((platform) => platform.id)
    }

    const searchCriteria: GameRespositorySearchCriteria = {
      title: criteria.title ?? '',
      platformIds: platformIds ?? [],
      developer: criteria.developer ?? '',
      publisher: criteria.publisher ?? '',
      edition: criteria.edition ?? '',
      genre: criteria.genre ?? '',
      notes: criteria.notes ?? '',
    }

    return this.gameRepository.search(searchCriteria)
  }
}
