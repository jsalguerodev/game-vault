import type { Model } from 'mongoose'

import { normalize, escape } from '../../config/plugins/index.js'
import { PlatformEntity } from '../../domain/entities/index.js'
import {
  PlatformNotFoundError,
  DuplicatePlatformError,
} from '../../domain/errors/index.js'
import { validateMongoId } from '../database/mongodb/validators/index.js'
import type {
  PlatformRepository,
  UpdatePlatformData,
  PlatformFilters,
  PlatformSearchCriteria,
} from '../../domain/repositories/index.js'
import type { PlatformPersistence } from '../database/mongodb/models/index.js'

export class MongoPlatformRepository implements PlatformRepository {
  constructor(private readonly platformModel: Model<PlatformPersistence>) {}

  async create(platform: PlatformEntity): Promise<PlatformEntity> {
    try {
      const newPlatform = await this.platformModel.create({
        name: platform.name,
        normalizedName: normalize(platform.name),
        manufacturer: platform.manufacturer,
        normalizedManufacturer: normalize(platform.manufacturer),
        type: platform.type,
        releaseYear: platform.releaseYear,
      })

      return PlatformEntity.fromMongoObject(newPlatform)
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new DuplicatePlatformError()
      }

      throw error
    }
  }

  async update(id: string, data: UpdatePlatformData): Promise<PlatformEntity> {
    try {
      validateMongoId(id)
      const editingPlatform = await this.platformModel.findById(id)

      if (!editingPlatform) {
        throw new PlatformNotFoundError(id)
      }

      const { name, manufacturer, releaseYear, type } = data

      if (name !== undefined) {
        editingPlatform.name = name
        editingPlatform.normalizedName = normalize(name)
      }

      if (manufacturer !== undefined) {
        editingPlatform.manufacturer = manufacturer
        editingPlatform.normalizedManufacturer = normalize(manufacturer)
      }

      if (releaseYear !== undefined) editingPlatform.releaseYear = releaseYear
      if (type !== undefined) editingPlatform.type = type

      await editingPlatform.save()

      return PlatformEntity.fromMongoObject(editingPlatform)
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new DuplicatePlatformError()
      }

      throw error
    }
  }

  async delete(id: string): Promise<void> {
    validateMongoId(id)

    const platform = await this.platformModel.findByIdAndDelete(id)

    if (!platform) {
      throw new PlatformNotFoundError(id)
    }
  }

  async findAll(): Promise<PlatformEntity[]> {
    const platforms = await this.platformModel.find()

    return platforms.map((platform) => PlatformEntity.fromMongoObject(platform))
  }

  async filter(filters: PlatformFilters): Promise<PlatformEntity[]> {
    const query = this.platformModel.find()

    if (filters.name !== undefined) {
      query.where('normalizedName').equals(normalize(filters.name))
    }

    if (filters.manufacturer !== undefined) {
      query
        .where('normalizedManufacturer')
        .equals(normalize(filters.manufacturer))
    }

    if (filters.releaseYear !== undefined) {
      query.where('releaseYear').equals(filters.releaseYear)
    }

    if (filters.type !== undefined) {
      query.where('type').equals(filters.type)
    }

    const platforms = await query.exec()

    return platforms.map((platform) => PlatformEntity.fromMongoObject(platform))
  }

  async findById(id: string): Promise<PlatformEntity> {
    validateMongoId(id)

    const platform = await this.platformModel.findById(id)

    if (!platform) {
      throw new PlatformNotFoundError(id)
    }

    return PlatformEntity.fromMongoObject(platform)
  }

  async search(criteria: PlatformSearchCriteria): Promise<PlatformEntity[]> {
    const query = this.platformModel.find()

    if (criteria.name?.trim()) {
      const normalizedCriteria = normalize(criteria.name)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('normalizedName').regex(regex)
    }

    if (criteria.manufacturer !== undefined) {
      const normalizedCriteria = normalize(criteria.manufacturer)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('normalizedManufacturer').regex(regex)
    }

    const platforms = await query.exec()

    return platforms.map((platform) => PlatformEntity.fromMongoObject(platform))
  }
}
