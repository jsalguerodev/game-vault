export type GameFormat = 'digital' | 'physical'

export interface GameEntityOptions {
  title: string
  format: GameFormat
  id?: string
  platformId?: string | null
  developer?: string
  publisher?: string
  releaseYear?: number | null
  edition?: string
  genres?: string[]
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export class GameEntity {
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
  readonly createdAt: Date
  private _updatedAt: Date

  constructor(options: GameEntityOptions) {
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
    this.createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt ?? new Date()
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  static fromMongoObject = (object: { [key: string]: any }): GameEntity => {
    const {
      title,
      platformId,
      format,
      _id,
      releaseYear,
      developer,
      publisher,
      edition,
      genres,
      notes,
      createdAt,
      updatedAt,
    } = object

    return new GameEntity({
      title,
      format,
      developer,
      publisher,
      releaseYear,
      edition,
      genres,
      notes,
      createdAt,
      updatedAt,
      id: _id.toString(),
      platformId: platformId?.toString() ?? null,
    })
  }
}
