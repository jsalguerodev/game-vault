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
