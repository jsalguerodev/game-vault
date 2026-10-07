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
  UpdateGameStatus,
  UpdateCompletionDate,
} from './application/use-cases/index.js'
import {
  RecordPlaySession,
  UpdateTotalPlayTime,
  UpdateLastPlayedDate,
} from './application/use-cases/index.js'
import {
  AddWishlistEntry,
  ListWishlistEntries,
  UpdateWishlistEntryPriority,
} from './application/use-cases/index.js'
import {
  PlatformModel,
  GameModel,
  PlaySessionModel,
  WishlistModel,
} from './infrastructure/database/mongodb/models/index.js'
import {
  MongoPlatformRepository,
  MongoGameRepository,
  MongoPlaySessionRepository,
  MongoWishlistRepository,
} from './infrastructure/repositories/index.js'

async function main(): Promise<void> {
  const platformRepository = new MongoPlatformRepository(PlatformModel)
  const gameRepository = new MongoGameRepository(GameModel)
  const playSessionRepository = new MongoPlaySessionRepository(PlaySessionModel)
  const wishlistRepository = new MongoWishlistRepository(WishlistModel)

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
    const removePlatform = new RemovePlatform(
      platformRepository,
      gameRepository,
      wishlistRepository,
    )

    const addGame = new AddGame(gameRepository, platformRepository)
    const listGames = new ListGames(gameRepository)
    const filterGames = new FilterGames(gameRepository)
    const searchGames = new SearchGames(gameRepository, platformRepository)
    const updateGame = new UpdateGame(gameRepository)
    const removeGame = new RemoveGame(gameRepository, playSessionRepository)
    const updateGameStatus = new UpdateGameStatus(gameRepository)
    const updateCompletionDate = new UpdateCompletionDate(gameRepository)

    const recordPlaySession = new RecordPlaySession(
      playSessionRepository,
      gameRepository,
    )
    const updateTotalPlayTime = new UpdateTotalPlayTime(playSessionRepository)
    const updateLastPlayedDate = new UpdateLastPlayedDate(playSessionRepository)

    const addWishlistEntry = new AddWishlistEntry(
      wishlistRepository,
      platformRepository,
    )
    const listWishlistEntries = new ListWishlistEntries(wishlistRepository)
    const updateWishlistEntryPriority = new UpdateWishlistEntryPriority(
      wishlistRepository,
    )

    console.log('GameVault initialized.')
  } catch (error) {
    if (error instanceof Error)
      console.log('Error initializing GameVault:', error.message)
  } finally {
    await MongoDatabase.disconnect()
  }
}

main()
