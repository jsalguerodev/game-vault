import type { GameEntity, GameStatus } from '../../../domain/entities/index.js'
import type { GameRepository } from '../../../domain/repositories/index.js'
import { InvalidGameIdError } from '../../../domain/errors/index.js'

interface UpdateGameStatusData {
  status: GameStatus
  completedAt?: Date | null
}

interface UpdateGameStatusUseCase {
  execute(id: string, data: UpdateGameStatusData): Promise<GameEntity>
}

export class UpdateGameStatus implements UpdateGameStatusUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  public async execute(
    id: string,
    data: UpdateGameStatusData,
  ): Promise<GameEntity> {
    if (!id.trim()) {
      throw new InvalidGameIdError(id)
    }

    if (data.status === 'completed' && data.completedAt == null) {
      throw new Error(
        'Completion date is required when game status is completed',
      )
    }

    const game = await this.gameRepository.findById(id)

    if (game.completedAt !== null && data.status !== 'completed') {
      data.completedAt = null
    }

    return this.gameRepository.update(id, data)
  }
}
