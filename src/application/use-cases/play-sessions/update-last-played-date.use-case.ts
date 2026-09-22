import type { PlaySessionEntity } from '../../../domain/entities/index.js'
import type { PlaySessionRespository } from '../../../domain/repositories/index.js'
import { InvalidPlaySessionIdError } from '../../../domain/errors/index.js'

interface UpdateLastPlayedDateUseCase {
  execute(id: string, date: Date): Promise<PlaySessionEntity>
}

export class UpdateLastPlayedDate implements UpdateLastPlayedDateUseCase {
  constructor(private readonly playSessionRepository: PlaySessionRespository) {}

  public async execute(id: string, date: Date): Promise<PlaySessionEntity> {
    if (!id.trim()) {
      throw new InvalidPlaySessionIdError(id)
    }

    if (
      date === undefined ||
      Number.isNaN(date.getTime()) ||
      date.getFullYear() < 1
    ) {
      throw new Error('Date is not valid')
    }

    await this.playSessionRepository.findById(id)
    return await this.playSessionRepository.update(id, { playedAt: date })
  }
}
