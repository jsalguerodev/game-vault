import type { PlaySessionRespository } from '../../../domain/repositories/index.js'
import { InvalidPlaySessionIdError } from '../../../domain/errors/index.js'

interface RemovePlaySessionUseCase {
  execute(id: string): Promise<void>
}

export class RemovePlaySession implements RemovePlaySessionUseCase {
  constructor(private readonly playSessionRepository: PlaySessionRespository) {}

  public async execute(id: string): Promise<void> {
    if (!id.trim()) {
      throw new InvalidPlaySessionIdError(id)
    }

    await this.playSessionRepository.delete(id)
  }
}
