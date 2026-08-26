import { MongoDatabase } from './infrastructure/database/mongodb/connection.js'
import { envs } from './config/plugins/index.js'
import {
  AddPlatform,
  ListPlatforms,
  UpdatePlatform,
  FilterPlatforms,
  SearchPlatform,
  RemovePlatform,
} from './application/use-cases/index.js'
import {
  AddGame,
  ListGames,
  FilterGames,
  SearchGames,
  UpdateGame,
  RemoveGame,
} from './application/use-cases/index.js'
import {
  PlatformModel,
  GameModel,
} from './infrastructure/database/mongodb/models/index.js'
import {
  MongoPlatformRepository,
  MongoGameRepository,
} from './infrastructure/repositories/index.js'

async function main(): Promise<void> {
  const platformRepository = new MongoPlatformRepository(PlatformModel)
  const gameRepository = new MongoGameRepository(GameModel)

  try {
    await MongoDatabase.connect({
      mongodbUrl: envs.MONGO_URL,
      databaseName: envs.MONGO_DB_NAME,
      serverSelectionTimeoutMs: 5000,
    })

    const addPlatform = new AddPlatform(platformRepository)
    const listPlatforms = new ListPlatforms(platformRepository)
    const updatePlatform = new UpdatePlatform(platformRepository)
    const filterPlatforms = new FilterPlatforms(platformRepository)
    const searchPlatforms = new SearchPlatform(platformRepository)
    const removePlatform = new RemovePlatform(platformRepository)

    const addGame = new AddGame(gameRepository, platformRepository)
    const listGames = new ListGames(gameRepository)
    const filterGames = new FilterGames(gameRepository)
    const searchGames = new SearchGames(gameRepository, platformRepository)
    const updateGame = new UpdateGame(gameRepository)
    const removeGame = new RemoveGame(gameRepository)

    console.log('GameVault initialized.')
  } catch (error) {
    if (error instanceof Error)
      console.log('Error initializing GameVault: ', error.message)
  } finally {
    await MongoDatabase.disconnect()
  }
}

main()
