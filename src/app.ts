import { MongoDatabase } from './infrastructure/database/mongodb/connection.js'
import { envs } from './config/plugins/index.js'
import {
  AddPlatform,
  ListPlatforms,
  UpdatePlatform,
  FilterPlatforms,
  SearchPlatform,
  AddGame,
  ListGames,
  FilterGames
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

    const addGame = new AddGame(gameRepository, platformRepository)
    const listGames = new ListGames(gameRepository)
    const filterGames = new FilterGames(gameRepository)

    const games = await filterGames.execute({
      platformId: '6a7bbc6e16992b3b53b29212'
    })

    console.log('GameVault initialized.')
    console.log(games)
  } catch (error) {
    if (error instanceof Error)
      console.log('Error initializing GameVault: ', error.message)
  } finally {
    await MongoDatabase.disconnect()
  }
}

main()
