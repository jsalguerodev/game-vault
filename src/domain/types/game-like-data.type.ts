export type GameFormat = 'digital' | 'physical'

export interface GameLikeData {
  title: string
  format: GameFormat
  platformId?: string | null
  developer?: string
  publisher?: string
  releaseYear?: number | null
  edition?: string
  genres?: string[]
  notes?: string
}

export interface GameLikeUpdateData {
  title?: string
  platformId?: string
  format?: GameFormat
  developer?: string
  publisher?: string
  releaseYear?: number | null
  edition?: string
  genres?: string[]
  notes?: string
}

export interface GameLikeSearchCriteriaData {
  title?: string
  developer?: string
  publisher?: string
  edition?: string
  genre?: string
  notes?: string
}

export interface GameLikeFiltersData {
  title?: string
  platformId?: string
  format?: GameFormat
  developer?: string
  publisher?: string
  releaseYear?: number | null
  edition?: string
  genres?: string[]
}
