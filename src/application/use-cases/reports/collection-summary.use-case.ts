import type { CollectionSummary } from '../../../domain/types/index.js'
import type { ReportRepository } from '../../../domain/repositories/index.js'

interface CollectionSummaryReportUseCase {
  execute(): Promise<CollectionSummary>
}

export class CollectionSummaryReport implements CollectionSummaryReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  public async execute(): Promise<CollectionSummary> {
    return await this.reportRepository.getCollectionSummary()
  }
}
