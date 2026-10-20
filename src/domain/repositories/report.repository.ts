import type {
  CollectionSummaryType,
  PlatformReportType,
  WishlistReportType,
  PlaytimeReportType,
  CompletionReportType,
} from '../types/index.js'

export interface ReportRepository {
  getCollectionSummary(): Promise<CollectionSummaryType>
  getPlatformReport(): Promise<PlatformReportType>
  getWishlistReport(): Promise<WishlistReportType>
  getPlaytimeReport(): Promise<PlaytimeReportType>
  getCompletionReport(): Promise<CompletionReportType>
}
