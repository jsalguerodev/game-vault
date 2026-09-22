import { GameModel, PlatformModel, PlaySessionModel } from '../models/index.js'

interface ClearDatabaseDataResult {
  deletedGames: number
  deletedPlatforms: number
  deletedSessions: number
}

export const clearDatabaseData = async (): Promise<ClearDatabaseDataResult> => {
  const clearPlaySessions = await PlaySessionModel.deleteMany({})
  const clearGames = await GameModel.deleteMany({})
  const clearPlatforms = await PlatformModel.deleteMany({})

  return {
    deletedGames: clearGames.deletedCount,
    deletedPlatforms: clearPlatforms.deletedCount,
    deletedSessions: clearPlaySessions.deletedCount,
  }
}
