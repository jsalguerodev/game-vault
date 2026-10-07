import type { GameLikeData, GameFormat } from '../types/index.js'

export type WishlistPriority = 'low' | 'medium' | 'high'

export interface WishlistOptions extends GameLikeData {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  priority: WishlistPriority
  targetPrice?: number | null
  targetDiscount?: number | null
}

export class WishlistEntity {
  public title: string
  public platformId: string | null
  public format: GameFormat
  public id: string
  public edition: string
  public genres: string[]
  public developer: string
  public publisher: string
  public releaseYear: number | null
  public notes: string
  public priority: WishlistPriority
  public targetPrice: number | null
  public targetDiscount: number | null
  readonly createdAt: Date
  private _updatedAt: Date

  constructor(options: WishlistOptions) {
    const {
      title,
      platformId,
      format,
      id,
      edition,
      genres,
      developer,
      publisher,
      releaseYear,
      notes,
      priority,
      targetPrice,
      targetDiscount,
      createdAt,
      updatedAt,
    } = options

    if (!title.trim()) {
      throw new Error('Game title is required')
    }

    if (!format.trim()) {
      throw new Error('Game format is required')
    }

    if (
      releaseYear != null &&
      (!Number.isInteger(releaseYear) || releaseYear < 1)
    ) {
      throw new Error('Release year is not valid')
    }

    if (targetPrice && targetPrice < 0) {
      throw new Error('Target price is not valid')
    }

    if (targetDiscount && (targetDiscount < 0 || targetDiscount > 100)) {
      throw new Error('Target discount is not valid')
    }

    this.title = title.trim()
    this.format = format
    this.platformId = platformId ?? null
    this.id = id ?? ''
    this.edition = edition ?? 'standard'
    this.genres = genres ? [...genres] : []
    this.developer = developer ?? ''
    this.publisher = publisher ?? ''
    this.releaseYear = releaseYear ?? null
    this.notes = notes ?? ''
    this.priority = priority
    this.targetPrice = targetPrice ?? null
    this.targetDiscount = targetDiscount ?? null
    this.createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt ?? new Date()
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  static fromMongoObject = (object: { [key: string]: any }): WishlistEntity => {
    const {
      title,
      platformId,
      format,
      _id,
      edition,
      genres,
      developer,
      publisher,
      releaseYear,
      notes,
      priority,
      targetPrice,
      targetDiscount,
      createdAt,
      updatedAt,
    } = object

    return new WishlistEntity({
      title,
      format,
      edition,
      genres,
      developer,
      publisher,
      releaseYear,
      notes,
      priority,
      targetPrice,
      targetDiscount,
      createdAt,
      updatedAt,
      id: _id.toString(),
      platformId: platformId?.toString() ?? null,
    })
  }
}
