import type { PlatformRepository } from '../../../domain/repositories/index.js'
import { InvalidPlatformIdError } from '../../../domain/errors/index.js'

interface RemovePlatformUseCase {
  execute(id: string): Promise<void>
}

export class RemovePlatform implements RemovePlatformUseCase {
  constructor(private readonly platformRepository: PlatformRepository) {}

  public async execute(id: string): Promise<void> {
    if (!id.trim()) {
      throw new InvalidPlatformIdError(id)
    }

    await this.platformRepository.delete(id)
  }
}
