import { beforeAll, afterAll, beforeEach, describe, test, expect } from 'vitest'
import { CollectionSummaryReport } from '../../../../src/application/use-cases/index.js'
import { MongoReportRepository } from '../../../../src/infrastructure/repositories/index.js'
import {
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
} from '../../../../src/infrastructure/database/mongodb/models/index.js'
import {
  connectTestDatabase,
  disconnectTestDatabase,
  clearTestDatabase,
} from '../../../helpers/mongodb-test.helper.js'
import { normalize } from '../../../../src/config/plugins/index.js'

const reportRepository = new MongoReportRepository(
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
)

const collectionSummary = new CollectionSummaryReport(reportRepository)

describe('Collection Summary', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  test('Should return zero totals when the collection is empty', async () => {
    const report = await collectionSummary.execute()

    expect(report.totalGames).toBe(0)
    expect(report.byStatus.backlog).toBe(0)
    expect(report.byStatus.cataloged).toBe(0)
    expect(report.byStatus.completed).toBe(0)
    expect(report.byStatus.dropped).toBe(0)
    expect(report.byStatus.paused).toBe(0)
    expect(report.byStatus.playing).toBe(0)
  })

  test('Should return the total number of games in the collection', async () => {
    await GameModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        status: 'playing',
        format: 'digital',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        status: 'backlog',
        format: 'physical',
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        status: 'cataloged',
        format: 'physical',
      },
    ])

    const report = await collectionSummary.execute()

    expect(report.totalGames).toBe(3)
  })

  test('Should count games grouped by each status', async () => {
    await GameModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        status: 'playing',
        format: 'digital',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        status: 'backlog',
        format: 'physical',
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        status: 'cataloged',
        format: 'physical',
      },
    ])

    const report = await collectionSummary.execute()

    expect(report.byStatus.backlog).toBe(1)
    expect(report.byStatus.cataloged).toBe(1)
    expect(report.byStatus.playing).toBe(1)
  })

  test('Should return zero for statuses without games', async () => {
    await GameModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        status: 'playing',
        format: 'digital',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        status: 'backlog',
        format: 'physical',
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        status: 'cataloged',
        format: 'physical',
      },
    ])

    const report = await collectionSummary.execute()

    expect(report.byStatus.completed).toBe(0)
    expect(report.byStatus.dropped).toBe(0)
    expect(report.byStatus.paused).toBe(0)
  })

  test('Should exclude wishlist items from the collection totals', async () => {
    await GameModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        status: 'playing',
        format: 'digital',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        status: 'backlog',
        format: 'physical',
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        status: 'cataloged',
        format: 'physical',
      },
    ])

    await WishlistModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        status: 'playing',
        format: 'digital',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        status: 'backlog',
        format: 'physical',
      },
    ])

    const report = await collectionSummary.execute()

    expect(report.totalGames).toBe(3)
    expect(report.byStatus.backlog).toBe(1)
    expect(report.byStatus.cataloged).toBe(1)
    expect(report.byStatus.completed).toBe(0)
    expect(report.byStatus.dropped).toBe(0)
    expect(report.byStatus.paused).toBe(0)
    expect(report.byStatus.playing).toBe(1)
  })

  test('Should reflect game status changes in the status counts', async () => {
    const games = await GameModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        status: 'playing',
        format: 'digital',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        status: 'backlog',
        format: 'physical',
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        status: 'cataloged',
        format: 'physical',
      },
    ])

    const report = await collectionSummary.execute()

    await GameModel.updateOne({ _id: games[0]._id }, { status: 'completed' })

    const updatedReport = await collectionSummary.execute()

    expect(report.totalGames).toBe(3)
    expect(updatedReport.totalGames).toBe(3)

    expect(report.byStatus.completed).toBe(0)
    expect(updatedReport.byStatus.completed).toBe(1)

    expect(report.byStatus.playing).toBe(1)
    expect(updatedReport.byStatus.playing).toBe(0)
  })

  test('Should reflect deleted games in the collection totals', async () => {
    const games = await GameModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        status: 'playing',
        format: 'digital',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        status: 'backlog',
        format: 'physical',
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        status: 'cataloged',
        format: 'physical',
      },
    ])

    const report = await collectionSummary.execute()

    await GameModel.deleteOne({ _id: games[0]._id })

    const updatedReport = await collectionSummary.execute()

    expect(report.totalGames).toBe(3)
    expect(updatedReport.totalGames).toBe(2)

    expect(report.byStatus.playing).toBe(1)
    expect(updatedReport.byStatus.playing).toBe(0)
  })
})
