import type { GameRepository } from '../../../domain/repositories/index.js'
import { InvalidGameIdError } from '../../../domain/errors/invalid-game-id.error.js'

interface RemoveGameUseCase {
  execute(id: string): Promise<void>
}

export class RemoveGame implements RemoveGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  public async execute(id: string): Promise<void> {
    if (!id.trim()) {
      throw new InvalidGameIdError(id)
    }

    await this.gameRepository.delete(id)
  }
}
