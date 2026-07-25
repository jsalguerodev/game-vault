import type { PlatformEntity, PlatformType} from '../entities/index.js'

export interface UpdatePlatformData {
  name?: string
  manufacturer?: string
  type?: PlatformType;
  releaseYear?: number | null
}

export interface PlatformRepository {
  create (platform: PlatformEntity): Promise<PlatformEntity>
  update (id: string, data: UpdatePlatformData): Promise<PlatformEntity>
  delete (id: string): Promise<void>
  findAll (): Promise<PlatformEntity[]>
}
