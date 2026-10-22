import type { PlaytimeReportType } from '../../../domain/types/index.js'
import type { ReportRepository } from '../../../domain/repositories/index.js'

interface PlaytimeReportUseCase {
  execute(): Promise<PlaytimeReportType>
}

export class PlaytimeReport implements PlaytimeReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  public async execute(): Promise<PlaytimeReportType> {
    return await this.reportRepository.getPlaytimeReport()
  }
}
