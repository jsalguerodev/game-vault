import type { WishlistReportType } from '../../../domain/types/index.js'
import type { ReportRepository } from '../../../domain/repositories/index.js'

interface WishlistReportUseCase {
  execute(): Promise<WishlistReportType>
}

export class WishlistReport implements WishlistReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  public async execute(): Promise<WishlistReportType> {
    return await this.reportRepository.getWishlistReport()
  }
}
