import type { GameEntity } from '../../../domain/entities/index.js'
import type {
  GameRepository,
  UpdateGameData,
} from '../../../domain/repositories/game.repository.js'
import { InvalidGameIdError } from '../../../domain/errors/index.js'

interface UpdateGameUseCase {
  execute(id: string, data: UpdateGameData): Promise<GameEntity>
}

export class UpdateGame implements UpdateGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  public async execute(id: string, data: UpdateGameData): Promise<GameEntity> {
    if (!id.trim()) {
      throw new InvalidGameIdError(id)
    }

    if (data.title !== undefined && !data.title?.trim()) {
      throw new Error('Game title is required')
    }

    await this.gameRepository.findById(id)

    return this.gameRepository.update(id, data)
  }
}
