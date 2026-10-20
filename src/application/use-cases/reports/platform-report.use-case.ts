import type { PlatformReportType } from '../../../domain/types/index.js'
import type { ReportRepository } from '../../../domain/repositories/index.js'

interface PlatformReportUseCase {
  execute(): Promise<PlatformReportType>
}

export class PlatformReport implements PlatformReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}
  public async execute(): Promise<PlatformReportType> {
    return await this.reportRepository.getPlatformReport()
  }
}
