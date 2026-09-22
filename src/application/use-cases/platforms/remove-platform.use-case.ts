import type {
  PlatformRepository,
  GameRepository,
} from '../../../domain/repositories/index.js'
import { InvalidPlatformIdError } from '../../../domain/errors/index.js'

interface RemovePlatformOptions {
  replacementPlatformId?: string | null
}
interface RemovePlatformUseCase {
  execute(id: string, options: RemovePlatformOptions): Promise<void>
}

export class RemovePlatform implements RemovePlatformUseCase {
  constructor(
    private readonly platformRepository: PlatformRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  public async execute(
    id: string,
    options: RemovePlatformOptions,
  ): Promise<void> {
    if (!id.trim()) {
      throw new InvalidPlatformIdError(id)
    }
    await this.platformRepository.findById(id)
    const replacementPlatformId = options.replacementPlatformId ?? null

    if (replacementPlatformId) {
      if (replacementPlatformId === id) {
        throw new Error(
          'Replacement platform id must be different from the platform id to delete',
        )
      }

      await this.platformRepository.findById(replacementPlatformId)

      await this.gameRepository.replacePlatformReference(
        id,
        replacementPlatformId,
      )
    } else {
      await this.gameRepository.replacePlatformReference(id, null)
    }

    await this.platformRepository.delete(id)
  }
}
