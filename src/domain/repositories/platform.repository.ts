import type { PlatformEntity, PlatformType } from '../entities/index.js'

export interface UpdatePlatformData {
  name?: string
  manufacturer?: string
  type?: PlatformType
  releaseYear?: number | null
}

export interface PlatformFilters {
  id?: string
  name?: string
  manufacturer?: string
  type?: PlatformType
  releaseYear?: number | null
}

export interface PlatformSearchCriteria {
  name?: string
  manufacturer?: string
}

export interface PlatformRepository {
  create(platform: PlatformEntity): Promise<PlatformEntity>
  update(id: string, data: UpdatePlatformData): Promise<PlatformEntity>
  delete(id: string): Promise<void>
  findAll(): Promise<PlatformEntity[]>
  findById(id: string): Promise<PlatformEntity>
  filter(filters: PlatformFilters): Promise<PlatformEntity[]>
  search(criteria: PlatformSearchCriteria): Promise<PlatformEntity[]>
}
