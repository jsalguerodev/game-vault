import type { CollectionSummaryType } from '../../../domain/types/index.js'
import type { ReportRepository } from '../../../domain/repositories/index.js'

interface CollectionSummaryReportUseCase {
  execute(): Promise<CollectionSummaryType>
}

export class CollectionSummaryReport implements CollectionSummaryReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  public async execute(): Promise<CollectionSummaryType> {
    return await this.reportRepository.getCollectionSummary()
  }
}
