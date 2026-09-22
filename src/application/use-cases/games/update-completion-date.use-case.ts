import type { GameEntity } from '../../../domain/entities/index.js'
import type {
  GameRepository,
  UpdateGameData,
} from '../../../domain/repositories/index.js'
import { InvalidGameIdError } from '../../../domain/errors/index.js'

interface UpdateCompletionDateUseCase {
  execute(id: string, completionDate: Date): Promise<GameEntity>
}

export class UpdateCompletionDate implements UpdateCompletionDateUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  public async execute(id: string, completionDate: Date): Promise<GameEntity> {
    if (!id.trim()) {
      throw new InvalidGameIdError(id)
    }

    if (
      completionDate == null ||
      Number.isNaN(completionDate.getTime()) ||
      completionDate.getFullYear() < 1 ||
      completionDate.getTime() > Date.now()
    ) {
      throw new Error('Completion date is not valid')
    }

    const game = await this.gameRepository.findById(id)

    const data: UpdateGameData =
      game.status === 'completed'
        ? {
            completedAt: completionDate,
          }
        : {
            status: 'completed',
            completedAt: completionDate,
          }

    return this.gameRepository.update(id, data)
  }
}
