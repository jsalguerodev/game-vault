import { PlatformEntity } from '../../../domain/entities/index.js'
import type { PlatformFilters, PlatformRepository } from '../../../domain/repositories/index.js'

interface FilterPlatformsUseCase {
  execute(filters: PlatformFilters): Promise<PlatformEntity[]>
}

export class FilterPlatforms implements FilterPlatformsUseCase {
  constructor(private readonly platformRepository: PlatformRepository) {}

  public async execute(filters: PlatformFilters): Promise<PlatformEntity[]> {
    const hasFilters = Object.values(filters).some(
      (value) => value !== undefined,
    )

    if (!hasFilters) {
      throw new Error ('At least one filter must be provided.')
    }

    return this.platformRepository.filter(filters)
  }
}
