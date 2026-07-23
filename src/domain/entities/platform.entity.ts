export type PlatformType =
  'console'
  | 'handheld'
  | 'pc'
  | 'pc-storefront'
  | 'other'

export interface PlatFormEntityOptions {
  name: string
  id?: string
  manufacturer?: string
  type?: PlatformType
  releaseYear?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export class PlatformEntity {
  public name: string
  public id: string
  public manufacturer: string
  public type: PlatformType
  public releaseYear: number | null
  readonly createdAt: Date
  private _updatedAt: Date

  constructor ( options: PlatFormEntityOptions ) {
    const { name, id, manufacturer, type, releaseYear, createdAt, updatedAt } = options

    if ( !name.trim() ){
      throw new Error ('Platform name is required')
    }

    if ( releaseYear != null && ( !Number.isInteger( releaseYear ) || releaseYear < 1 )) {
      throw new Error("Release year is not valid");
    }

    this.name = name.trim()
    this.id = id ?? ""
    this.manufacturer = manufacturer ?? ""
    this.type = type ?? "other"
    this.releaseYear = releaseYear ?? null
    this.createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt ?? new Date()
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
