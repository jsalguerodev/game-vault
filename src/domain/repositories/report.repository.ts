import type {
  CollectionSummary,
  PlatformReport,
  WishlistReport,
  PlaytimeReport,
  CompletionReport,
} from '../types/index.js'

export interface ReportRepository {
  getCollectionSummary(): Promise<CollectionSummary>
  getPlatformReport(): Promise<PlatformReport>
  getWishlistReport(): Promise<WishlistReport>
  getPlaytimeReport(): Promise<PlaytimeReport>
  getCompletionReport(): Promise<CompletionReport>
}
