import { GameEntity, type GameFormat } from '../../../domain/entities/index.js'
import type {
  GameRepository,
  PlatformRepository,
} from '../../../domain/repositories/index.js'

interface AddGameOptions {
  title: string
  format: GameFormat
  platformId?: string | null
  releaseYear?: number | null
  edition?: string
  genres?: string[]
  notes?: string
}

interface AddGameUseCase {
  execute(options: AddGameOptions): Promise<GameEntity>
}

export class AddGame implements AddGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly platformRepository: PlatformRepository,
  ) {}

  public async execute(options: AddGameOptions): Promise<GameEntity> {
    const { title, platformId, format, releaseYear, edition, genres, notes } =
      options

    if (platformId && platformId !== null) {
      await this.platformRepository.findById(platformId)
    }

    const game = new GameEntity({
      title: title,
      format: format,
      platformId: platformId ?? null,
      releaseYear: releaseYear ?? null,
      edition: edition ?? '',
      genres: genres ?? [],
      notes: notes ?? '',
    })

    return this.gameRepository.create(game)
  }
}

// todo: test it!
