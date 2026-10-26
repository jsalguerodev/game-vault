import { MongoDatabase } from '../../src/infrastructure/database/mongodb/connection.js'
import { envs } from '../../src/config/plugins/index.js'
import { GameModel, PlatformModel, PlaySessionModel, WishlistModel } from '../../src/infrastructure/database/mongodb/models/index.js'
import mongoose from 'mongoose'

export const connectTestDatabase = async (): Promise<void> => {
  if (envs.MONGO_DB_NAME !== 'gamevault_test') {
    throw new Error('Tests must use the gamevault_test database')
  }

  await MongoDatabase.connect({
    mongodbUrl: envs.MONGO_URL,
    databaseName: envs.MONGO_DB_NAME,
    serverSelectionTimeoutMs: 5000,
  })
}

export const disconnectTestDatabase = async (): Promise<void> => {
  await MongoDatabase.disconnect()
}

export const clearTestDatabase = async (): Promise<void> => {
  const db = mongoose.connection.db

  if (!db || db.databaseName !== 'gamevault_test') {
    throw new Error('Database cleanup is only allowed on gamevault_test')
  }

  await GameModel.deleteMany({})
  await PlatformModel.deleteMany({})
  await PlaySessionModel.deleteMany({})
  await WishlistModel.deleteMany({})
}