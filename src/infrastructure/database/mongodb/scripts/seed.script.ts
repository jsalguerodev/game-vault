import { MongoDatabase } from '../connection.js'
import { envs, normalize } from '../../../../config/plugins/index.js'
import { clearDatabaseData } from './clear-database-data.script.js'
import {
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
} from '../models/index.js'
import {
  platformSeedData,
  gameSeedData,
  playSessionSeedData,
  wishlistSeedData,
} from './data/seed.data.js'

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

    const platformData = platformSeedData.map((platform) => ({
      ...platform,
      normalizedName: normalize(platform.name),
      normalizedManufacturer: normalize(platform.manufacturer),
    }))

    const platforms = await PlatformModel.insertMany(platformData)

    const platformsMap = new Map(
      platforms.map((platform) => [platform.normalizedName, platform._id]),
    )

    const gameDocuments = gameSeedData.map((game) => {
      const { platformName, ...gameData } = game
      const platformId = platformsMap.get(normalize(platformName))

      if (!platformId) {
        throw new Error(
          `Platform "${platformName}" was not found for game "${game.title}".`,
        )
      }

      return {
        ...gameData,
        platformId,
        normalizedTitle: normalize(game.title),
        normalizedDeveloper: normalize(game.developer ?? ''),
        normalizedPublisher: normalize(game.publisher ?? ''),
      }
    })

    const games = await GameModel.insertMany(gameDocuments)

    const gamesMap = new Map(
      games.map((game) => [game.normalizedTitle, game._id]),
    )

    const playSessionsDocuments = playSessionSeedData.map((session) => {
      const { gameTitle, ...playSessionSeedData } = session
      const gameId = gamesMap.get(normalize(session.gameTitle))

      return {
        ...playSessionSeedData,
        gameId,
      }
    })

    const playSessions = await PlaySessionModel.insertMany(
      playSessionsDocuments,
    )

    const wishlistDocuments = wishlistSeedData.map((game) => {
      const { platformName, ...gameData } = game
      const platformId = platformsMap.get(normalize(platformName))

      if (!platformId) {
        throw new Error(
          `Platform "${platformName}" was not found for game "${game.title}".`,
        )
      }

      return {
        ...gameData,
        platformId,
        normalizedTitle: normalize(game.title),
        normalizedDeveloper: normalize(game.developer ?? ''),
        normalizedPublisher: normalize(game.publisher ?? ''),
      }
    })

    const wishlistedGames = await WishlistModel.insertMany(wishlistDocuments)

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
