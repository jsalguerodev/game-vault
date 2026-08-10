import type { PlatformEntity } from '../../../domain/entities/platform.entity.js'
import type {
  PlatformRepository,
  UpdatePlatformData,
} from '../../../domain/repositories/index.js'
import { InvalidPlatformIdError } from '../../../domain/errors/index.js'

interface UpdatePlatformUseCase {
  execute(id: string, data: UpdatePlatformData): Promise<PlatformEntity>
}

export class UpdatePlatform implements UpdatePlatformUseCase {
  constructor(private readonly platformRepository: PlatformRepository) {}

  public async execute(
    id: string,
    data: UpdatePlatformData,
  ): Promise<PlatformEntity> {
    if (!id.trim()) {
      throw new InvalidPlatformIdError(id)
    }

    const { name, manufacturer } = data
    const updatingPlatform = await this.platformRepository.findById(id)

    const lookupName = name ?? updatingPlatform.name
    const lookupManufacturer = manufacturer ?? updatingPlatform.manufacturer

    const existingPlatforms = await this.platformRepository.filter({
      name: lookupName,
      manufacturer: lookupManufacturer ?? '',
    })

    const duplicateExists = existingPlatforms.some(
      (platform) => platform.id !== updatingPlatform.id,
    )

    if (duplicateExists) {
      throw new Error('Platform already exists')
    }

    return this.platformRepository.update(id, data)
  }
}
