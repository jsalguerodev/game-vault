import { GameEntity } from '../../../domain/entities/index.js'
import type { GameRepository } from '../../../domain/repositories/index.js'

interface ListGamesUseCase {
  execute(): Promise<GameEntity[]>
}

export class ListGames implements ListGamesUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  public async execute(): Promise<GameEntity[]> {
    return await this.gameRepository.findAll()
  }
}
