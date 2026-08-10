import { PlatformEntity } from '../../../domain/entities/index.js'
import type { PlatformSearchCriteria, PlatformRepository } from '../../../domain/repositories/index.js'

interface SearchPlatformsUseCase {
  execute(criteria: PlatformSearchCriteria): Promise<PlatformEntity[]>
}

export class SearchPlatform implements SearchPlatformsUseCase {
  constructor(private readonly platformRepository: PlatformRepository){}

  public async execute(criteria: PlatformSearchCriteria): Promise<PlatformEntity[]> {
    const hasCriteria = Object.values(criteria).some(
      (value) => value !== undefined,
    )

    if (!hasCriteria) {
      throw new Error ('Search criteria must be provided.')
    }

    return this.platformRepository.search(criteria)
  }

}