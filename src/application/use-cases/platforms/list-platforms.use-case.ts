import { PlatformEntity } from '../../../domain/entities/index.js'
import type { PlatformRepository } from '../../../domain/repositories/index.js'

interface ListPlatformsUseCase {
  execute(): Promise<PlatformEntity[]>
}

export class ListPlatforms implements ListPlatformsUseCase {
  constructor(private readonly platformRepository: PlatformRepository) {}

  public async execute(): Promise<PlatformEntity[]> {
    return await this.platformRepository.findAll()
  }
}
