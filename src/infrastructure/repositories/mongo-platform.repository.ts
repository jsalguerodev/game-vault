import type { Model } from 'mongoose'
import { isObjectIdOrHexString as isValidID } from 'mongoose'

import { normalize } from '../../config/plugins/index.js'
import { PlatformEntity } from '../../domain/entities/index.js'
import {
  PlatformNotFoundError,
  InvalidPlatformIdError,
} from '../../domain/errors/index.js'
import type {
  PlatformRepository,
  UpdatePlatformData,
  PlatformFilters,
  PlatformSearchCriteria
} from '../../domain/repositories/index.js'
import type { PlatformPersistence } from '../database/mongodb/models/index.js'

const validatePlatformId = (id: string) => {
  if (!isValidID(id)) {
    throw new InvalidPlatformIdError(id)
  }
}

export class MongoPlatformRepository implements PlatformRepository {
  constructor(private readonly platformModel: Model<PlatformPersistence>) {}

  async create(platform: PlatformEntity): Promise<PlatformEntity> {
    const newPlatform = await this.platformModel.create({
      name: platform.name,
      normalizedName: normalize(platform.name),
      manufacturer: platform.manufacturer,
      normalizedManufacturer: normalize(platform.manufacturer),
      type: platform.type,
      releaseYear: platform.releaseYear,
    })

    return PlatformEntity.fromMongoObject(newPlatform)
  }

  async update(id: string, data: UpdatePlatformData): Promise<PlatformEntity> {
    validatePlatformId(id)

    const editingPlatform = await this.platformModel.findById(id)

    if (!editingPlatform) {
      throw new Error('Platform not found')
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
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findAll(): Promise<PlatformEntity[]> {
    const platforms = await this.platformModel.find()

    return platforms.map((platform) => PlatformEntity.fromMongoObject(platform))
  }

  async filter(filters: PlatformFilters): Promise<PlatformEntity[]> {
    const query = this.platformModel.find()

    if (filters.name !== undefined) {
      query.where('normalizedName').equals( normalize(filters.name) )
    }

    if (filters.manufacturer !== undefined) {
      query.where('normalizedManufacturer').equals( normalize(filters.manufacturer) )
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
    validatePlatformId(id)

    const platform = await this.platformModel.findById(id)

    if (!platform) {
      throw new PlatformNotFoundError(id)
    }

    return PlatformEntity.fromMongoObject(platform)
  }

  async search(criteria: PlatformSearchCriteria): Promise<PlatformEntity[]> {
    const query = this.platformModel.find()

    if (criteria.name !== undefined) {
      const regex = new RegExp( normalize(criteria.name), 'i')
      query.where('normalizedName').regex(regex)
    }

    if (criteria.manufacturer !== undefined) {
      const regex = new RegExp( normalize(criteria.manufacturer), 'i')
      query.where('normalizedManufacturer').regex(regex)
    }

    const platforms = await query.exec()

    return platforms.map((platform) => PlatformEntity.fromMongoObject(platform))
  }
}
