import mongoose from 'mongoose'

import type { Model } from 'mongoose'
import type {
  PlaySessionFilters,
  PlaySessionRespository,
  updatePlaySessionData,
} from '../../domain/repositories/index.js'
import type { PlaySessionPersistence } from '../database/mongodb/models/index.js'

import { PlaySessionEntity } from '../../domain/entities/play-session.entity.js'
import { PlaySessionNotFoundError } from '../../domain/errors/index.js'
import { validateMongoId } from '../database/mongodb/validators/index.js'

export class MongoPlaySessionRepository implements PlaySessionRespository {
  constructor(
    private readonly playSessionModel: Model<PlaySessionPersistence>,
  ) {}
  async create(session: PlaySessionEntity): Promise<PlaySessionEntity> {
    if (session.gameId) validateMongoId(session.gameId)

    const newSession = await this.playSessionModel.create({
      gameId: new mongoose.Types.ObjectId(session.gameId),
      playedAt: session.playedAt,
      durationMinutes: session.durationMinutes,
      notes: session.notes,
    })

    return PlaySessionEntity.fromMongoObject(newSession)
  }

  async update(
    id: string,
    data: updatePlaySessionData,
  ): Promise<PlaySessionEntity> {
    validateMongoId(id)

    const session = await this.playSessionModel.findById(id)

    if (!session) {
      throw new Error(`Session id ${id} not found`)
    }

    const { gameId, durationMinutes, playedAt, notes } = data

    if (gameId !== undefined) {
      validateMongoId(gameId)
      session.gameId = new mongoose.Types.ObjectId(gameId)
    }

    if (playedAt !== undefined) {
      session.playedAt = playedAt
    }

    if (durationMinutes !== undefined) {
      session.durationMinutes = durationMinutes
    }

    if (notes !== undefined) {
      session.notes = notes
    }

    await session.save()

    return PlaySessionEntity.fromMongoObject(session)
  }

  async delete(id: string): Promise<void> {
    validateMongoId(id)

    const playSession = await this.playSessionModel.findByIdAndDelete(id)

    if (!playSession) {
      throw new PlaySessionNotFoundError(id)
    }
  }

  async findAll(): Promise<PlaySessionEntity[]> {
    const sessions = await this.playSessionModel.find()

    return sessions.map((session) => PlaySessionEntity.fromMongoObject(session))
  }

  async findById(id: string): Promise<PlaySessionEntity> {
    validateMongoId(id)

    const session = await this.playSessionModel.findById(id)

    if (!session) {
      throw new PlaySessionNotFoundError(id)
    }

    return PlaySessionEntity.fromMongoObject(session)
  }

  async filter(filters: PlaySessionFilters): Promise<PlaySessionEntity[]> {
    const query = this.playSessionModel.find()

    if (filters.gameId !== undefined) {
      validateMongoId(filters.gameId)

      const objectId = new mongoose.Types.ObjectId(filters.gameId)
      query.where('gameId').equals(objectId)
    }

    if (filters.minDurationMinutes !== undefined) {
      query.where('durationMinutes').gte(filters.minDurationMinutes)
    }

    if (filters.maxDurationMinutes !== undefined) {
      query.where('durationMinutes').lte(filters.maxDurationMinutes)
    }

    const playedAtFilter: {
      $gte?: Date
      $lte?: Date
    } = {}

    if (filters.initialDate !== undefined) {
      playedAtFilter.$gte = filters.initialDate
    }

    if (filters.finalDate !== undefined) {
      playedAtFilter.$lte = filters.finalDate
    }

    if (Object.keys(playedAtFilter).length > 0) {
      query.find({ playedAt: playedAtFilter })
    }

    const sessions = await query.exec()

    return sessions.map((session) => PlaySessionEntity.fromMongoObject(session))
  }

  async replaceGameReference(
    currentGameId: string,
    newGameId: string | null,
  ): Promise<number> {
    validateMongoId(currentGameId)

    if (newGameId !== null) {
      validateMongoId(newGameId)
    }

    const operation = await this.playSessionModel.updateMany(
      {
        gameId: currentGameId,
      },
      {
        gameId: newGameId !== null ? newGameId : null,
      },
    )

    return operation.modifiedCount
  }
}
