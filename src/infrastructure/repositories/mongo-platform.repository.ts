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
} from '../../domain/repositories/index.js'
import type { PlatformPersistence } from '../database/mongodb/models/platform.model.js'

const validatePlatformId = (id: string) => {
  if (!isValidID(id)) {
    throw new InvalidPlatformIdError(id)
  }
}

export class MongoPlatformRepository implements PlatformRepository {
  constructor(private readonly platformModel: Model<PlatformPersistence>) {}

  async create(platform: PlatformEntity): Promise<PlatformEntity> {
    const platformDocument = await this.platformModel.create({
      name: platform.name,
      normalizedName: normalize(platform.name),
      manufacturer: platform.manufacturer,
      normalizedManufacturer: normalize(platform.manufacturer),
      type: platform.type,
      releaseYear: platform.releaseYear,
    })

    return new PlatformEntity({
      id: platformDocument._id.toString(),
      name: platformDocument.name,
      manufacturer: platformDocument.manufacturer,
      type: platformDocument.type,
      releaseYear: platformDocument.releaseYear,
      createdAt: platformDocument.createdAt,
      updatedAt: platformDocument.updatedAt,
    })
  }

  async update(id: string, data: UpdatePlatformData): Promise<PlatformEntity> {
    validatePlatformId(id)

    const editingDocument = await this.platformModel.findById(id)

    if (!editingDocument) {
      throw new Error('Platform not found')
    }

    const { name, manufacturer, releaseYear, type } = data

    if (name !== undefined) {
      editingDocument.name = name
      editingDocument.normalizedName = normalize(name)
    }

    if (manufacturer !== undefined) {
      editingDocument.manufacturer = manufacturer
      editingDocument.normalizedManufacturer = normalize(manufacturer)
    }

    if (releaseYear !== undefined) editingDocument.releaseYear = releaseYear
    if (type !== undefined) editingDocument.type = type

    await editingDocument.save()

    return new PlatformEntity({
      id: editingDocument._id.toString(),
      name: editingDocument.name,
      manufacturer: editingDocument.manufacturer,
      type: editingDocument.type,
      releaseYear: editingDocument.releaseYear,
      createdAt: editingDocument.createdAt,
      updatedAt: editingDocument.updatedAt,
    })
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findAll(filters: PlatformFilters = {}): Promise<PlatformEntity[]> {
    const query = this.platformModel.find()

    if (filters.id !== undefined) {
      query.where('_id').equals(filters.id)
    }

    if (filters.name !== undefined) {
      query.where('name').equals(filters.name)
    }

    if (filters.manufacturer !== undefined) {
      query.where('manufacturer').equals(filters.manufacturer)
    }

    if (filters.type !== undefined) {
      query.where('type').equals(filters.type)
    }

    const platformsDocuments = await query.exec()

    return platformsDocuments.map(
      (platform) =>
        new PlatformEntity({
          id: platform._id.toString(),
          name: platform.name,
          manufacturer: platform.manufacturer,
          type: platform.type,
          releaseYear: platform.releaseYear,
          createdAt: platform.createdAt,
          updatedAt: platform.updatedAt,
        }),
    )
  }

  async findById(id: string): Promise<PlatformEntity> {
    validatePlatformId(id)

    const platformDocument = await this.platformModel.findById(id)

    if (!platformDocument) {
      throw new PlatformNotFoundError(id)
    }

    return new PlatformEntity({
      id: platformDocument._id.toString(),
      name: platformDocument.name,
      manufacturer: platformDocument.manufacturer,
      type: platformDocument.type,
      releaseYear: platformDocument.releaseYear,
      createdAt: platformDocument.createdAt,
      updatedAt: platformDocument.updatedAt,
    })
  }

  async findByNameAndManufacturer(
    name: string,
    manufacturer: string,
  ): Promise<PlatformEntity[]> {
    const platformsDocuments = await this.platformModel.find({
      normalizedName: normalize(name),
      normalizedManufacturer: normalize(manufacturer),
    })

    return platformsDocuments.map(
      (platform) =>
        new PlatformEntity({
          id: platform._id.toString(),
          name: platform.name,
          manufacturer: platform.manufacturer,
          type: platform.type,
          releaseYear: platform.releaseYear,
          createdAt: platform.createdAt,
          updatedAt: platform.updatedAt,
        }),
    )
  }
}
