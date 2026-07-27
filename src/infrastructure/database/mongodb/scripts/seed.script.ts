import { MongoDatabase } from '../connection.js'
import { envs } from '../../../../config/plugins/index.js'
import { clearDatabaseData } from './clear-database-data.script.js'
import { GameModel, PlatformModel } from '../models/index.js'
import { platformSeedData, gameSeedData } from './data/seed.data.js'

const runSeed = async (): Promise<void> => {
  try {
    if (envs.PROD || envs.MONGO_DB_NAME !== 'gamevault') {
      throw new Error(
        'Database seeding is disabled in production or for non-GameVault databases.',
      )
    }

    await MongoDatabase.connect({
      mongodbUrl: envs.MONGO_URL,
      databaseName: envs.MONGO_DB_NAME,
      serverSelectionTimeoutMs: 5000,
    })

    await clearDatabaseData()

    const platforms = await PlatformModel.insertMany(platformSeedData)

    const platformsMap = new Map(
      platforms.map((platform) => [platform.name, platform._id]),
    )

    const gameDocuments = gameSeedData.map((game) => {
      const { platformName, ...gameData } = game
      const platformId = platformsMap.get(platformName)

      if (!platformId) {
        throw new Error(
          `Platform "${platformName}" was not found for game "${game.title}".`,
        )
      }

      return {
        ...gameData,
        platformId,
      }
    })

    const games = await GameModel.insertMany(gameDocuments)

    console.log(`Database seeded successfully.`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error clearing the database: ${error.message}`)
    }
    process.exitCode = 1
  } finally {
    await MongoDatabase.disconnect()
  }
}

runSeed()
