import {
  GameEntity,
  type GameFormat,
  type GameStatus,
} from '../../../domain/entities/index.js'
import type {
  GameRepository,
  PlatformRepository,
} from '../../../domain/repositories/index.js'

interface AddGameOptions {
  title: string
  format: GameFormat
  platformId?: string | null
  developer?: string
  publisher?: string
  releaseYear?: number | null
  edition?: string
  genres?: string[]
  notes?: string
  status?: GameStatus
  completedAt?: Date | null
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
    const {
      title,
      platformId,
      format,
      developer,
      publisher,
      releaseYear,
      edition,
      genres,
      notes,
      status,
      completedAt,
    } = options

    if (platformId && platformId !== null) {
      await this.platformRepository.findById(platformId)
    }

    const game = new GameEntity({
      title: title,
      format: format,
      platformId: platformId ?? null,
      developer: developer ?? '',
      publisher: publisher ?? '',
      releaseYear: releaseYear ?? null,
      edition: edition ?? '',
      genres: genres ?? [],
      notes: notes ?? '',
      status: status ?? 'cataloged',
      completedAt: completedAt ?? null,
    })

    return this.gameRepository.create(game)
  }
}
