import { MongoDatabase } from '../connection.js'
import { envs } from '../../../../config/plugins/index.js'
import { clearDatabaseData } from './clear-database-data.script.js'

const runClearDatabase = async (): Promise<void> => {
  try {
    if (envs.PROD || envs.MONGO_DB_NAME !== 'gamevault') {
      throw new Error(
        'Database clearing is disabled in production or for non-GameVault databases.',
      )
    }

    await MongoDatabase.connect({
      mongodbUrl: envs.MONGO_URL,
      databaseName: envs.MONGO_DB_NAME,
      serverSelectionTimeoutMs: 5000,
    })

    const {
      deletedGames,
      deletedPlatforms,
      deletedSessions,
      deletedWishlistEntries,
    } = await clearDatabaseData()

    console.log(`Deleted sessions: ${deletedSessions}`)
    console.log(`Deleted games: ${deletedGames}`)
    console.log(`Deleted platforms: ${deletedPlatforms}`)
    console.log(`Deleted wishlist entries: ${deletedWishlistEntries}`)

    console.log(`Database cleared successfully.`)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error clearing the database: ${error.message}`)
    }
    process.exitCode = 1
  } finally {
    await MongoDatabase.disconnect()
  }
}

runClearDatabase()
