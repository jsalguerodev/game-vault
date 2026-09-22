import type {
  GameRepository,
  PlaySessionRespository,
} from '../../../domain/repositories/index.js'
import { InvalidGameIdError } from '../../../domain/errors/invalid-game-id.error.js'

interface RemoveGameOptions {
  replacementGameId?: string | null
}

interface RemoveGameUseCase {
  execute(id: string, options: RemoveGameOptions): Promise<void>
}

export class RemoveGame implements RemoveGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly playSessionRepository: PlaySessionRespository,
  ) {}

  public async execute(id: string, options: RemoveGameOptions): Promise<void> {
    if (!id.trim()) {
      throw new InvalidGameIdError(id)
    }

    await this.gameRepository.findById(id)
    const replacementGameId = options.replacementGameId ?? null

    if (replacementGameId) {
      if (replacementGameId === id) {
        throw new Error(
          'Replacement game id must be different from the game id to delete',
        )
      }

      await this.gameRepository.findById(replacementGameId)

      await this.playSessionRepository.replaceGameReference(
        id,
        replacementGameId,
      )
    } else {
      await this.playSessionRepository.replaceGameReference(id, null)
    }

    await this.gameRepository.delete(id)
  }
}
