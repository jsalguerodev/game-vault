import type { PlaySessionEntity } from '../../../domain/entities/index.js'
import type { PlaySessionRespository } from '../../../domain/repositories/index.js'
import { InvalidPlaySessionIdError } from '../../../domain/errors/index.js'

interface UpdateTotalPlayTimeUseCase {
  execute(id: string, playTime: number): Promise<PlaySessionEntity>
}

export class UpdateTotalPlayTime implements UpdateTotalPlayTimeUseCase {
  constructor(private readonly playSessionRepository: PlaySessionRespository) {}

  public async execute(
    id: string,
    playTime: number,
  ): Promise<PlaySessionEntity> {
    if (!id.trim()) {
      throw new InvalidPlaySessionIdError(id)
    }

    if (playTime < 1 || !Number.isInteger(playTime) || playTime === undefined) {
      throw new Error('Play time is not valid')
    }

    await this.playSessionRepository.findById(id)
    return await this.playSessionRepository.update(id, {
      durationMinutes: playTime,
    })
  }
}
