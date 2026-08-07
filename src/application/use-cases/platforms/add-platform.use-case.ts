import { normalize } from '../../../config/plugins/index.js'
import {
  PlatformEntity,
  type PlatformType,
} from '../../../domain/entities/index.js'
import type { PlatformRepository } from '../../../domain/repositories/index.js'

interface AddPlatformOptions {
  name: string
  manufacturer?: string
  type?: PlatformType
  releaseYear?: number | null
}

interface AddPlatformUseCase {
  execute(options: AddPlatformOptions): Promise<PlatformEntity>
}

export class AddPlatform implements AddPlatformUseCase {
  constructor(private readonly platformRepository: PlatformRepository) {}

  public async execute(options: AddPlatformOptions): Promise<PlatformEntity> {
    const { name, manufacturer, type, releaseYear } = options
    const existingPlatforms = await this.platformRepository.filter({
      normalizedName: normalize(name),
      normalizedManufacturer: normalize(manufacturer ?? ''),
    })

    if (existingPlatforms.length > 0) {
      throw new Error('Platform already exists')
    }

    const platform = new PlatformEntity({
      name: name,
      manufacturer: manufacturer ?? '',
      type: type ?? 'other',
      releaseYear: releaseYear ?? null,
    })

    return this.platformRepository.create(platform)
  }
}
