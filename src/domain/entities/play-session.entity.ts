export interface PlaySessionOptions {
  gameId: string
  playedAt: Date
  durationMinutes: number
  id?: string
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export class PlaySessionEntity {
  public gameId: string
  public playedAt: Date
  public durationMinutes: number
  public id: string
  public notes: string
  readonly createdAt: Date
  private _updatedAt: Date

  constructor(options: PlaySessionOptions) {
    const {
      gameId,
      playedAt,
      durationMinutes,
      id,
      notes,
      createdAt,
      updatedAt,
    } = options

    if (!gameId.trim()) {
      throw new Error('Game id is required')
    }

    if (
      playedAt == null ||
      Number.isNaN(playedAt.getTime()) ||
      playedAt.getFullYear() < 1
    ) {
      throw new Error('playedAt date is not valid')
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes < 1) {
      throw new Error('Play time is not valid')
    }

    this.gameId = gameId.trim()
    this.playedAt = playedAt
    this.durationMinutes = durationMinutes
    this.id = id ?? ''
    this.notes = notes?.trim() ?? ''
    this.createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt ?? new Date()
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  static fromMongoObject = (object: {
    [key: string]: any
  }): PlaySessionEntity => {
    const {
      gameId,
      playedAt,
      durationMinutes,
      _id,
      notes,
      createdAt,
      updatedAt,
    } = object

    return new PlaySessionEntity({
      gameId: gameId.toString(),
      playedAt,
      durationMinutes,
      id: _id.toString(),
      notes,
      createdAt,
      updatedAt,
    })
  }
}
