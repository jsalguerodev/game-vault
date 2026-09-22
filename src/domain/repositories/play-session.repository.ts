import { PlaySessionEntity } from '../entities/index.js'

export interface updatePlaySessionData {
  gameId?: string
  playedAt?: Date
  durationMinutes?: number
  notes?: string
}

export interface PlaySessionFilters {
  gameId?: string
  minDurationMinutes?: number
  maxDurationMinutes?: number
  initialDate?: Date
  finalDate?: Date
}

export interface PlaySessionRespository {
  create(session: PlaySessionEntity): Promise<PlaySessionEntity>
  update(id: string, data: updatePlaySessionData): Promise<PlaySessionEntity>
  delete(id: string): Promise<void>
  findAll(): Promise<PlaySessionEntity[]>
  filter(filters: PlaySessionFilters): Promise<PlaySessionEntity[]>
  findById(id: string): Promise<PlaySessionEntity>
  replaceGameReference(
    currentGameId: string,
    newGameId: string | null,
  ): Promise<number>
}
