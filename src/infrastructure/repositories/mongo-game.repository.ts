import type { Model } from 'mongoose'
import type { GamePersistence } from '../database/mongodb/models/index.js'
import { GameEntity } from '../../domain/entities/game.entity.js'
import type {
  GameFilters,
  GameRepository,
  GameRespositorySearchCriteria,
  UpdateGameData,
} from '../../domain/repositories/index.js'
import mongoose from 'mongoose'
import { normalize, escape } from '../../config/plugins/index.js'
import { InvalidPlatformIdError } from '../../domain/errors/index.js'

export class MongoGameRepository implements GameRepository {
  constructor(private readonly gameModel: Model<GamePersistence>) {}
  async create(game: GameEntity): Promise<GameEntity> {
    if (game.platformId && !mongoose.isObjectIdOrHexString(game.platformId)) {
      throw new InvalidPlatformIdError(game.platformId)
    }

    const newGame = await this.gameModel.create({
      title: game.title,
      normalizedTitle: normalize(game.title),
      platformId:
        game.platformId && game.platformId != null
          ? new mongoose.Types.ObjectId(game.platformId)
          : null,
      format: game.format,
      developer: game.developer,
      normalizedDeveloper: normalize(game.developer),
      publisher: game.publisher,
      normalizedPublisher: normalize(game.publisher),
      releaseYear: game.releaseYear,
      edition: game.edition,
      genres: game.genres,
      notes: game.notes,
    })

    return GameEntity.fromMongoObject(newGame)
  }
  update(id: string, data: UpdateGameData): Promise<GameEntity> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async findAll(): Promise<GameEntity[]> {
    const games = await this.gameModel.find()

    return games.map((game) => GameEntity.fromMongoObject(game))
  }

  async filter(filters: GameFilters): Promise<GameEntity[]> {
    const query = this.gameModel.find()

    if (filters.platformId !== undefined) {
      const objectId = new mongoose.Types.ObjectId(filters.platformId)
      query.where('platformId').equals(objectId)
    }

    if (filters.title !== undefined) {
      query.where('normalizedTitle').equals(normalize(filters.title))
    }

    if (filters.format !== undefined) {
      query.where('format').equals(filters.format)
    }

    if (filters.developer !== undefined) {
      query.where('normalizedDeveloper').equals(normalize(filters.developer))
    }

    if (filters.publisher !== undefined) {
      query.where('normalizedPublisher').equals(normalize(filters.publisher))
    }

    if (filters.releaseYear !== undefined) {
      query.where('releaseYear').equals(filters.releaseYear)
    }

    if (filters.edition !== undefined) {
      query.where('edition').equals(filters.edition)
    }

    if (filters.genres !== undefined) {
      query.where('genres').equals(filters.genres)
    }

    const games = await query.exec()

    return games.map((game) => GameEntity.fromMongoObject(game))
  }
  findById(id: string): Promise<GameEntity> {
    throw new Error('Method not implemented.')
  }
  async search(criteria: GameRespositorySearchCriteria): Promise<GameEntity[]> {
    const query = this.gameModel.find()

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

    const games = await query.exec()

    return games.map((game) => GameEntity.fromMongoObject(game))
  }
}
