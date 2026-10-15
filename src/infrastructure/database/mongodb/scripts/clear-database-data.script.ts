import {
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
} from '../models/index.js'

interface ClearDatabaseDataResult {
  deletedGames: number
  deletedPlatforms: number
  deletedSessions: number
  deletedWishlistEntries: number
}

export const clearDatabaseData = async (): Promise<ClearDatabaseDataResult> => {
  const clearPlaySessions = await PlaySessionModel.deleteMany({})
  const clearGames = await GameModel.deleteMany({})
  const clearPlatforms = await PlatformModel.deleteMany({})
  const clearWishlistsEntries = await WishlistModel.deleteMany({})

  return {
    deletedGames: clearGames.deletedCount,
    deletedPlatforms: clearPlatforms.deletedCount,
    deletedSessions: clearPlaySessions.deletedCount,
    deletedWishlistEntries: clearWishlistsEntries.deletedCount,
  }
}
