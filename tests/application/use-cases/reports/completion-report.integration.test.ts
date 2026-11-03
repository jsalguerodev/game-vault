import { beforeAll, afterAll, beforeEach, describe, test, expect } from 'vitest'
import { CompletionReport } from '../../../../src/application/use-cases/index.js'
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
  addDefaultCompletionData,
  addDefaultCompletionDataWithSessions,
  addDefaultGameData,
} from '../../../helpers/mongodb-test.helper.js'
import { normalize } from '../../../../src/config/plugins/index.js'

const reportRepository = new MongoReportRepository(
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
)

const completionReport = new CompletionReport(reportRepository)

describe('Completion Report', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  test('Should return an empty completion report when no games exist', async () => {
    const report = await completionReport.execute()

    expect(report.completedGames).toBe(0)
    expect(report.completedThisYear).toBe(0)
    expect(report.completionPercentage).toBe(0)
    expect(report.averageCompletionPlaytimeMinutes).toBe(0)
    expect(report.mostCompletedGenre).toBeNull()
  })

  test('Should count games with completed status', async () => {
    await addDefaultCompletionData()

    const report = await completionReport.execute()

    expect(report.completedGames).toBe(3)
  })

  test('Should calculate completion percentage using all games in the collection', async () => {
    await addDefaultCompletionData()

    const report = await completionReport.execute()

    expect(report.completionPercentage).toBe(42.86)
  })

  test('Should round completion percentage to two decimal places', async () => {
    await addDefaultCompletionData()

    const report = await completionReport.execute()

    expect(report.completionPercentage).toBe(42.86)
  })

  test('Should count games completed during the current UTC year', async () => {
    await addDefaultCompletionData()

    const report = await completionReport.execute()

    expect(report.completedThisYear).toBe(2)
  })

  test('Should include completions at the start of the current UTC year', async () => {
    await addDefaultCompletionData()

    const report = await completionReport.execute()

    expect(report.completedThisYear).toBe(2)
  })

  test('Should exclude completions before the current UTC year and at the start of the next UTC year', async () => {
    await GameModel.insertMany([
      {
        title: 'Game 10',
        normalizedTitle: normalize('Game 10'),
        status: 'completed',
        completedAt: new Date('12-12-2024'),
        format: 'digital',
      },
    ])

    const report = await completionReport.execute()

    expect(report.completedThisYear).toBe(0)
  })

  test('Should calculate average completion playtime from total sessions per completed game', async () => {
    await addDefaultCompletionDataWithSessions()

    const report = await completionReport.execute()

    expect(report.averageCompletionPlaytimeMinutes).toBe(143.5)
  })

  test('Should exclude games without completed status from average completion playtime', async () => {
    await addDefaultCompletionDataWithSessions()

    const report = await completionReport.execute()

    expect(report.averageCompletionPlaytimeMinutes).toBe(143.5)
  })

  test('Should return the most completed genre and its completed game count', async () => {
    await addDefaultCompletionData()

    const report = await completionReport.execute()

    expect(report.mostCompletedGenre?.genre).toBe('RPG')
    expect(report.mostCompletedGenre?.completedGames).toBe(2)
  })

  test('Should count each genre of completed games with multiple genres', async () => {
    await addDefaultCompletionData()

    const report = await completionReport.execute()

    expect(report.mostCompletedGenre?.genre).toBe('RPG')
    expect(report.mostCompletedGenre?.completedGames).toBe(2)
  })

  test('Should exclude games without completed status from genre counts', async () => {
    await addDefaultCompletionData()

    const report = await completionReport.execute()

    expect(report.mostCompletedGenre?.genre).toBe('RPG')
    expect(report.mostCompletedGenre?.completedGames).toBe(2)
  })

  test('Should return null for the most completed genre when no completed games have genres', async () => {
    await addDefaultGameData()

    const report = await completionReport.execute()

    expect(report.mostCompletedGenre).toBeNull()
  })
})
