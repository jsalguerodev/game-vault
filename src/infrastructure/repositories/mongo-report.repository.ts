import type { Model } from 'mongoose'
import type { ReportRepository } from '../../domain/repositories/index.js'
import type {
  CollectionSummaryType,
  PlatformReportType,
  WishlistReportType,
  PlaytimeReportType,
  CompletionReportType,
} from '../../domain/types/report.type.js'
import type {
  GamePersistence,
  PlatformPersistence,
  PlaySessionPersistence,
  WishlistPersistence,
} from '../database/mongodb/models/index.js'
import type {
  GameStatus,
  WishlistPriority,
} from '../../domain/entities/index.js'

interface StatusAggregation {
  _id: GameStatus
  statusCount: number
}

interface platformSummary {
  platformId: string
  platformName: string
  gameCount: number
}

interface priorityAggregation {
  _id: WishlistPriority
  priorityCount: number
}

interface WishlistStatisticsAggregation {
  averageTargetPrice: number | null
  averageTargetDiscount: number | null
  itemsWithTargetPrice: number
  itemsWithTargetDiscount: number
}

export class MongoReportRepository implements ReportRepository {
  constructor(
    private readonly gameModel: Model<GamePersistence>,
    private readonly platformModel: Model<PlatformPersistence>,
    private readonly playSessionModel: Model<PlaySessionPersistence>,
    private readonly WishlistModel: Model<WishlistPersistence>,
  ) {}
  async getCollectionSummary(): Promise<CollectionSummaryType> {
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

  async getPlatformReport(): Promise<PlatformReportType> {
    const platforms = await this.platformModel.aggregate<platformSummary>([
      {
        $lookup: {
          from: 'games',
          localField: '_id',
          foreignField: 'platformId',
          as: 'games',
        },
      },
      {
        $project: {
          _id: 0,
          platformId: { $toString: '$_id' },
          platformName: '$name',
          gameCount: { $size: '$games' },
        },
      },
      {
        $sort: {
          platformName: 1,
        },
      },
    ])

    const unassignedGames = await this.gameModel.countDocuments({
      platformId: null,
    })

    const totalPlatforms = platforms.length

    return {
      totalPlatforms,
      platforms: [
        ...platforms,
        ...(unassignedGames > 0
          ? [
              {
                platformId: null,
                platformName: null,
                gameCount: unassignedGames,
              },
            ]
          : []),
      ],
    }
  }
  public async getWishlistReport(): Promise<WishlistReportType> {
    const wishlistSummary =
      await this.WishlistModel.aggregate<priorityAggregation>([
        {
          $group: {
            _id: '$priority',
            priorityCount: {
              $sum: 1,
            },
          },
        },
      ])

    const totalCount = wishlistSummary.reduce(
      (total, status) => total + status.priorityCount,
      0,
    )

    const priorityCounts = new Map(
      wishlistSummary.map((status) => [status._id, status.priorityCount]),
    )

    const statistics =
      await this.WishlistModel.aggregate<WishlistStatisticsAggregation>([
        {
          $group: {
            _id: null,
            averageTargetPrice: { $avg: '$targetPrice' },
            averageTargetDiscount: { $avg: '$targetDiscount' },
            itemsWithTargetPrice: {
              $sum: {
                $cond: [{ $ne: ['$targetPrice', null] }, 1, 0],
              },
            },
            itemsWithTargetDiscount: {
              $sum: {
                $cond: [{ $ne: ['$targetDiscount', null] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            averageTargetPrice: { $round: ['$averageTargetPrice', 2] },
            averageTargetDiscount: { $round: ['$averageTargetDiscount', 2] },
            itemsWithTargetPrice: 1,
            itemsWithTargetDiscount: 1,
          },
        },
      ])

    const summary = statistics[0]

    return {
      totalItems: totalCount,
      byPriority: {
        low: priorityCounts.get('low') ?? 0,
        medium: priorityCounts.get('medium') ?? 0,
        high: priorityCounts.get('high') ?? 0,
      },
      averageTargetPrice: summary?.averageTargetPrice ?? null,
      averageTargetDiscount: summary?.averageTargetDiscount ?? null,
      itemsWithTargetPrice: summary?.itemsWithTargetPrice ?? 0,
      itemsWithTargetDiscount: summary?.itemsWithTargetDiscount ?? 0,
    }
  }

  public async getPlaytimeReport(): Promise<PlaytimeReportType> {
    const recentDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const playtimeReport = await this.playSessionModel.aggregate([
      {
        $facet: {
          totalPlaytimeSummary: [
            {
              $group: {
                _id: null,
                totalPlaytime: { $sum: '$durationMinutes' },
              },
            },
            {
              $project: {
                _id: 0,
                totalPlaytime: 1,
              },
            },
          ],
          averagePlaytimeReport: [
            {
              $group: {
                _id: '$gameId',
                totalPlaytime: { $sum: '$durationMinutes' },
                totalSessions: { $sum: 1 },
              },
            },
            {
              $group: {
                _id: null,
                averagePlayTime: { $avg: '$totalPlaytime' },
              },
            },
            {
              $project: {
                _id: 0,
                averagePlayTime: { $round: ['$averagePlayTime', 2] },
              },
            },
          ],
          mostPlayedGameReport: [
            {
              $group: {
                _id: '$gameId',
                totalPlaytime: { $sum: '$durationMinutes' },
              },
            },
            {
              $sort: {
                totalPlaytime: -1,
                totalSessions: -1,
              },
            },
            {
              $limit: 1,
            },
            {
              $lookup: {
                from: 'games',
                localField: '_id',
                foreignField: '_id',
                as: 'game',
              },
            },
            {
              $unwind: '$game',
            },
            {
              $project: {
                _id: 0,
                gameId: { $toString: '$_id' },
                title: '$game.title',
                totalPlaytime: 1,
              },
            },
          ],
          recentlyPlayedReport: [
            {
              $match: {
                playedAt: { $gte: recentDate },
              },
            },
            {
              $group: {
                _id: '$gameId',
                totalPlaytime: { $sum: '$durationMinutes' },
              },
            },
            {
              $lookup: {
                from: 'games',
                localField: '_id',
                foreignField: '_id',
                as: 'game',
              },
            },
            {
              $unwind: '$game',
            },
            {
              $project: {
                _id: 0,
                gameId: { $toString: '$_id' },
                title: '$game.title',
                totalPlaytime: 1,
              },
            },
          ],
        },
      },
    ])

    const totalPlaytimeSummary = playtimeReport[0]?.totalPlaytimeSummary[0]
    const averagePlaytimeSummary = playtimeReport[0]?.averagePlaytimeReport[0]
    const mostPlayedGame = playtimeReport[0]?.mostPlayedGameReport[0]
    const recentlyPlayed = playtimeReport[0]?.recentlyPlayedReport

    return {
      totalPlaytimeMinutes: totalPlaytimeSummary?.totalPlaytime ?? 0,
      averagePlaytimeMinutesPerGame:
        averagePlaytimeSummary?.averagePlayTime ?? null,
      mostPlayedGame: {
        gameId: mostPlayedGame?.gameId ?? '',
        title: mostPlayedGame?.title ?? '',
        totalPlaytimeMinutes: mostPlayedGame?.totalPlaytime ?? null,
      },
      recentlyPlayedGames: {
        count: recentlyPlayed.length,
        games: [...recentlyPlayed],
      },
    }
  }

  getCompletionReport(): Promise<CompletionReportType> {
    throw new Error('Method not implemented.')
  }
}
