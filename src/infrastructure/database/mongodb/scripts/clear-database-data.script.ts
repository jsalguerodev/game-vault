import { GameModel, PlatformModel } from '../models/index.js'

interface ClearDatabaseDataResult {
  deletedGames: number
  deletedPlatforms: number
}

export const clearDatabaseData = async (): Promise<ClearDatabaseDataResult> => {
  const clearGames = await GameModel.deleteMany({})
  const clearPlatforms = await PlatformModel.deleteMany({})

  return {
    deletedGames: clearGames.deletedCount,
    deletedPlatforms: clearPlatforms.deletedCount,
  }
}
