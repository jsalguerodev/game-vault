import type { Model } from 'mongoose'
import type { GamePersistence } from '../database/mongodb/models/index.js'
import { GameEntity } from '../../domain/entities/game.entity.js'
import type {
  GameFilters,
  GameRepository,
  GameSearchCriteria,
  UpdateGameData,
} from '../../domain/repositories/index.js'
import mongoose from 'mongoose'
import { normalize } from '../../config/plugins/index.js'
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

    if ( filters.platformId !== undefined) {
      query.where('platformId').equals( normalize(filters.platformId) )
    }

    if ( filters.title !== undefined ) {
      query.where('normalizedTitle').equals( normalize(filters.title) )
    }

    if ( filters.format !== undefined ) {
      query.where('format').equals( filters.format )
    }

    if ( filters.developer !== undefined ) {
      query.where('normalizedDeveloper').equals( normalize(filters.developer) )
    }

    if ( filters.publisher !== undefined ) {
      query.where('normalizedPublisher').equals( normalize(filters.publisher) )
    }

    if ( filters.releaseYear !== undefined ) {
      query.where('releaseYear').equals( filters.releaseYear )
    }

    if ( filters.edition !== undefined ) {
      query.where('edition').equals( filters.edition )
    }

    if ( filters.genres !== undefined ) {
      query.where('genres').equals( filters.genres )
    }

    const games = await query.exec()

    return games.map((game) => GameEntity.fromMongoObject(game))
  }
  findById(id: string): Promise<GameEntity> {
    throw new Error('Method not implemented.')
  }
  search(criteria: GameSearchCriteria): Promise<GameEntity[]> {
    throw new Error('Method not implemented.')
  }
}
