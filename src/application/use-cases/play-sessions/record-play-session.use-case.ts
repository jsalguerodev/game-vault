import type {
  GameRepository,
  PlaySessionRespository,
} from '../../../domain/repositories/index.js'

import { PlaySessionEntity } from '../../../domain/entities/index.js'

interface RecordPlaySessionOptions {
  gameId: string
  playedAt: Date
  durationMinutes: number
  notes?: string
}

interface RecordPlaySessionUseCase {
  execute(options: RecordPlaySessionOptions): Promise<PlaySessionEntity>
}

export class RecordPlaySession implements RecordPlaySessionUseCase {
  constructor(
    private readonly playSessionRepository: PlaySessionRespository,
    private readonly gameRepository: GameRepository,
  ) {}

  public async execute(
    options: RecordPlaySessionOptions,
  ): Promise<PlaySessionEntity> {
    const { gameId, playedAt, durationMinutes, notes } = options

    if (gameId && gameId !== null) {
      await this.gameRepository.findById(gameId)
    }

    const session = new PlaySessionEntity({
      gameId: gameId,
      playedAt: playedAt,
      durationMinutes: durationMinutes,
      notes: notes ?? '',
    })

    return this.playSessionRepository.create(session)
  }
}
