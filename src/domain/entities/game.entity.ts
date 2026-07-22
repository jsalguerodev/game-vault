export type GameFormat = 'digital' | 'physical'

export interface GameEntityOptions {
  title: string
  platformId: string
  format: GameFormat
  releaseYear?: number | null
  edition?: string
  genres?: string[]
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export class GameEntity {

  public title: string
  public platformId: string
  public format: GameFormat
  public edition: string
  public genres: string[]
  public releaseYear: number | null
  public notes: string
  readonly createdAt: Date
  private _updatedAt: Date

  constructor ( options: GameEntityOptions ) {
    const { title, platformId, format, edition, genres, releaseYear, notes, createdAt, updatedAt} = options

    if( !title.trim() ) {
      throw new Error ('Game title is required')
    }

    if( !format.trim() ) {
      throw new Error ('Game format is required')
    }

    if ( releaseYear != null && ( !Number.isInteger( releaseYear ) || releaseYear < 1 )) {
      throw new Error("Release year is not valid");
    }

    this.title = title.trim()
    this.platformId = platformId
    this.format = format
    this.edition = edition ?? 'standard'
    this.genres = genres ? [...genres] : []
    this.releaseYear = releaseYear ?? null
    this.notes = notes ?? ""
    this.createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt ?? new Date()
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}