import type { CompletionReportType } from '../../../domain/types/index.js'
import type { ReportRepository } from '../../../domain/repositories/index.js'

interface CompletionReportUseCase {
  execute(): Promise<CompletionReportType>
}

export class CompletionReport implements CompletionReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}
  public async execute(): Promise<CompletionReportType> {
    return await this.reportRepository.getCompletionReport()
  }
}
