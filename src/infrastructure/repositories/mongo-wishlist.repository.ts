import type { Model } from 'mongoose'
import type {
  WishlistRepository,
  UpdateWishlistEntryData,
  WishlistRespositorySearchCriteria,
} from '../../domain/repositories/index.js'
import type { WishlistPersistence } from '../database/mongodb/models/index.js'
import { WishlistEntity } from '../../domain/entities/index.js'
import { validateMongoId } from '../database/mongodb/validators/index.js'
import { normalize, escape } from '../../config/plugins/index.js'
import { WishlistEntryNotFoundError } from '../../domain/errors/index.js'
import mongoose from 'mongoose'

export class MongoWishlistRepository implements WishlistRepository {
  constructor(private readonly wishlistModel: Model<WishlistPersistence>) {}

  async create(wishlistEntry: WishlistEntity): Promise<WishlistEntity> {
    if (wishlistEntry.platformId) {
      validateMongoId(wishlistEntry.platformId)
    }

    const newWishlistEntry = await this.wishlistModel.create({
      title: wishlistEntry.title,
      normalizedTitle: normalize(wishlistEntry.title),
      platformId:
        wishlistEntry.platformId && wishlistEntry.platformId !== null
          ? new mongoose.Types.ObjectId(wishlistEntry.platformId)
          : null,
      format: wishlistEntry.format,
      developer: wishlistEntry.developer,
      normalizedDeveloper: normalize(wishlistEntry.developer),
      publisher: wishlistEntry.publisher,
      normalizedPublisher: normalize(wishlistEntry.publisher),
      releaseYear: wishlistEntry.releaseYear,
      edition: wishlistEntry.edition,
      notes: wishlistEntry.notes,
      priority: wishlistEntry.priority,
      targetPrice: wishlistEntry.targetPrice,
      targetDiscount: wishlistEntry.targetDiscount,
    })

    return WishlistEntity.fromMongoObject(newWishlistEntry)
  }

  async update(
    id: string,
    data: UpdateWishlistEntryData,
  ): Promise<WishlistEntity> {
    validateMongoId(id)

    const wishlistEntry = await this.wishlistModel.findById(id)

    if (!wishlistEntry) {
      throw new WishlistEntryNotFoundError(id)
    }

    const {
      title,
      platformId,
      format,
      developer,
      publisher,
      releaseYear,
      edition,
      genres,
      notes,
      priority,
      targetPrice,
      targetDiscount,
    } = data

    if (title !== undefined) {
      wishlistEntry.title = title
      wishlistEntry.normalizedTitle = normalize(title)
    }

    if (platformId !== undefined) {
      validateMongoId(platformId)
      wishlistEntry.platformId = new mongoose.Types.ObjectId(platformId)
    }

    if (format !== undefined) {
      wishlistEntry.format = format
    }

    if (developer !== undefined) {
      wishlistEntry.developer = developer
      wishlistEntry.normalizedDeveloper = normalize(developer)
    }

    if (publisher !== undefined) {
      wishlistEntry.publisher = publisher
      wishlistEntry.normalizedPublisher = normalize(publisher)
    }

    if (releaseYear !== undefined) {
      wishlistEntry.releaseYear = releaseYear
    }

    if (edition !== undefined) {
      wishlistEntry.edition = edition
    }

    if (genres !== undefined) {
      wishlistEntry.genres = genres
    }

    if (notes !== undefined) {
      wishlistEntry.notes = notes
    }

    if (priority !== undefined) {
      wishlistEntry.priority = priority
    }

    if (targetPrice !== undefined) {
      wishlistEntry.targetPrice = targetPrice
    }
    if (targetDiscount !== undefined) {
      wishlistEntry.targetDiscount = targetDiscount
    }

    await wishlistEntry.save()

    return WishlistEntity.fromMongoObject(wishlistEntry)
  }
  async delete(id: string): Promise<void> {
    validateMongoId(id)

    const wishlistEntry = this.wishlistModel.findByIdAndDelete(id)

    if (!wishlistEntry) {
      throw new WishlistEntryNotFoundError(id)
    }
  }
  async findAll(): Promise<WishlistEntity[]> {
    const wishlist = await this.wishlistModel.find()

    return wishlist.map((entry) => WishlistEntity.fromMongoObject(entry))
  }
  async findById(id: string): Promise<WishlistEntity> {
    validateMongoId(id)

    const wishlistEntry = await this.wishlistModel.findById(id)

    if (!wishlistEntry) {
      throw new WishlistEntryNotFoundError(id)
    }

    return WishlistEntity.fromMongoObject(wishlistEntry)
  }
  async search(
    criteria: WishlistRespositorySearchCriteria,
  ): Promise<WishlistEntity[]> {
    const query = this.wishlistModel.find()

    if (criteria.title?.trim()) {
      const normalizedCriteria = normalize(criteria.title)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('normalizedTitle').regex(regex)
    }

    if (criteria.platformIds && criteria.platformIds.length > 0) {
      const objectIds = criteria.platformIds.map(
        (id) => new mongoose.Types.ObjectId(id),
      )
      query.where('platformId').in(objectIds)
    }

    if (criteria.developer?.trim()) {
      const normalizedCriteria = normalize(criteria.developer)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('normalizedDeveloper').regex(regex)
    }

    if (criteria.publisher?.trim()) {
      const normalizedCriteria = normalize(criteria.publisher)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('normalizedPublisher').regex(regex)
    }

    if (criteria.edition?.trim()) {
      const normalizedCriteria = normalize(criteria.edition)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('edition').regex(regex)
    }

    if (criteria.notes?.trim()) {
      const normalizedCriteria = normalize(criteria.notes)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('notes').regex(regex)
    }

    if (criteria.genre?.trim()) {
      const normalizedCriteria = normalize(criteria.genre)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('genres').regex(regex)
    }

    if (criteria.notes?.trim()) {
      const normalizedCriteria = normalize(criteria.notes)
      const regex = new RegExp(escape(normalizedCriteria), 'i')
      query.where('notes').regex(regex)
    }

    const whislistEntries = await query.exec()

    return whislistEntries.map((entry) => WishlistEntity.fromMongoObject(entry))
  }
  async replacePlatformReference(
    currentPlatformId: string,
    newPlatformId: string | null,
  ): Promise<number> {
    validateMongoId(currentPlatformId)

    if (newPlatformId !== null) {
      validateMongoId(newPlatformId)
    }

    const operation = await this.wishlistModel.updateMany(
      {
        platformId: currentPlatformId,
      },
      {
        platformId: newPlatformId !== null ? newPlatformId : null,
      },
    )

    return operation.modifiedCount
  }
}
