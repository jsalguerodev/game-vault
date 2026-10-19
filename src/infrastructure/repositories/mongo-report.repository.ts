import type { Model } from 'mongoose'
import type { ReportRepository } from '../../domain/repositories/index.js'
import type {
  CollectionSummary,
  PlatformReport,
  WishlistReport,
  PlaytimeReport,
  CompletionReport,
} from '../../domain/types/report.type.js'
import type {
  GamePersistence,
  PlatformPersistence,
  PlaySessionPersistence,
  WishlistPersistence,
} from '../database/mongodb/models/index.js'
import type { GameStatus } from '../../domain/entities/index.js'

interface StatusAggregation {
  _id: GameStatus
  statusCount: number
}

export class MongoReportRepository implements ReportRepository {
  constructor(
    private readonly gameModel: Model<GamePersistence>,
    private readonly platformModel: Model<PlatformPersistence>,
    private readonly playSessionModel: Model<PlaySessionPersistence>,
    private readonly WhislistModel: Model<WishlistPersistence>,
  ) {}
  async getCollectionSummary(): Promise<CollectionSummary> {
    const agg = await this.gameModel.aggregate<StatusAggregation>([
      {
        $group: {
          _id: '$status',
          statusCount: {
            $sum: 1,
          },
        },
      },
    ])

    const totalCount = agg.reduce(
      (total, status) => total + status.statusCount,
      0,
    )

    const statusCounts = new Map(
      agg.map((status) => [status._id, status.statusCount]),
    )

    return {
      totalGames: totalCount,
      byStatus: {
        backlog: statusCounts.get('backlog') ?? 0,
        playing: statusCounts.get('playing') ?? 0,
        paused: statusCounts.get('paused') ?? 0,
        completed: statusCounts.get('completed') ?? 0,
        dropped: statusCounts.get('dropped') ?? 0,
        cataloged: statusCounts.get('cataloged') ?? 0,
      },
    }
  }

  getPlatformReport(): Promise<PlatformReport> {
    throw new Error('Method not implemented.')
  }
  getWishlistReport(): Promise<WishlistReport> {
    throw new Error('Method not implemented.')
  }
  getPlaytimeReport(): Promise<PlaytimeReport> {
    throw new Error('Method not implemented.')
  }
  getCompletionReport(): Promise<CompletionReport> {
    throw new Error('Method not implemented.')
  }
}
