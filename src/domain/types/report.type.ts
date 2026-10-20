export interface CollectionSummaryType {
  totalGames: number
  byStatus: {
    backlog: number
    playing: number
    paused: number
    completed: number
    dropped: number
    cataloged: number
  }
}

export interface PlatformReportType {
  totalPlatforms: number
  platforms: {
    platformId: string | null
    platformName: string | null
    gameCount: number
  }[]
}

export interface WishlistReportType {
  totalItems: number
  byPriority: {
    low: number
    medium: number
    high: number
  }
  averageTargetPrice: number | null
  averageTargetDiscount: number | null
  itemsWithTargetPrice: number
  itemsWithTargetDiscount: number
}

export interface PlaytimeReportType {
  totalPlaytimeMinutes: number
  averagePlaytimeMinutesPerGame: number
  mostPlayedGame: {
    gameId: string
    title: string
    totalPlaytimeMinutes: number
  } | null
  recentlyPlayedGames: number
}

export interface CompletionReportType {
  completedGames: number
  completedThisYear: number
  completionPercentage: number
  averageCompletionPlaytimeMinutes: number | null
  mostCompletedGenre: {
    genre: string
    completedGames: number
  } | null
}
