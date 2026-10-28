import { beforeAll, afterAll, beforeEach, describe, test, expect } from 'vitest'
import { PlaytimeReport } from '../../../../src/application/use-cases/index.js'
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
  addDefaultPlaytimeSessions,
} from '../../../helpers/mongodb-test.helper.js'
import { normalize } from '../../../../src/config/plugins/index.js'
import { isObjectIdOrHexString } from 'mongoose'

const reportRepository = new MongoReportRepository(
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
)

const playtimeReport = new PlaytimeReport(reportRepository)

describe('Playtime Report', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  test('Should return an empty playtime report when no play sessions exist', async () => {
    const report = await playtimeReport.execute()

    expect(report.totalPlaytimeMinutes).toBe(0)
    expect(report.averagePlaytimeMinutesPerGame).toBeNull()
    expect(report.mostPlayedGame?.gameId).toBe('')
    expect(report.recentlyPlayedGames.count).toBe(0)
  })

  test('Should sum playtime across all play sessions', async () => {
    await addDefaultPlaytimeSessions()

    const report = await playtimeReport.execute()

    expect(report.totalPlaytimeMinutes).toBe(296)
  })

  test('Should calculate average playtime per game using each game total', async () => {
    await addDefaultPlaytimeSessions()

    const report = await playtimeReport.execute()

    const average = report.totalPlaytimeMinutes / 3

    expect(report.averagePlaytimeMinutesPerGame).toBeCloseTo(average, 2)
  })

  test('Should exclude games without play sessions from average playtime', async () => {
    await addDefaultPlaytimeSessions()

    const report = await playtimeReport.execute()

    const average = report.totalPlaytimeMinutes / 3

    expect(report.averagePlaytimeMinutesPerGame).toBeCloseTo(average, 2)
  })

  test('Should return the most played game with its identifier, title, and total playtime', async () => {
    await addDefaultPlaytimeSessions()

    const report = await playtimeReport.execute()

    expect(isObjectIdOrHexString(report.mostPlayedGame?.gameId)).toBe(true)
    expect(report.mostPlayedGame?.title).toBe('Game 3')
    expect(report.mostPlayedGame?.totalPlaytimeMinutes).toBe(127)
  })

  test('Should combine multiple sessions for the same game when selecting the most played game', async () => {
    await addDefaultPlaytimeSessions()

    const report = await playtimeReport.execute()

    expect(isObjectIdOrHexString(report.mostPlayedGame?.gameId)).toBe(true)
    expect(report.mostPlayedGame?.title).toBe('Game 3')
    expect(report.mostPlayedGame?.totalPlaytimeMinutes).toBe(127)
  })

  test('Should include games played within the last 30 days in recently played games', async () => {
    await addDefaultPlaytimeSessions()

    const report = await playtimeReport.execute()

    const recentlyPlayed = report.recentlyPlayedGames

    expect(recentlyPlayed.count).toBe(2)
    expect(recentlyPlayed.games[0]?.title).toBe('Game 3')
    expect(recentlyPlayed.games[0]?.totalPlaytime).toBe(127)

    expect(recentlyPlayed.games[1]?.title).toBe('Game 1')
    expect(recentlyPlayed.games[1]?.totalPlaytime).toBe(11)
  })

  test('Should exclude games played more than 30 days ago', async () => {
    await addDefaultPlaytimeSessions()

    const report = await playtimeReport.execute()

    const recentlyPlayed = report.recentlyPlayedGames

    const game1Exists = recentlyPlayed.games.some(
      (game) => game.title === 'Game 0',
    )

    expect(game1Exists).toBe(false)
  })

  test('Should exclude older sessions from recently played totals while including them in overall totals', async () => {
    await addDefaultPlaytimeSessions()

    const report = await playtimeReport.execute()

    const average = report.totalPlaytimeMinutes / 3
    const recentlyPlayed = report.recentlyPlayedGames

    const game1Exists = recentlyPlayed.games.some(
      (game) => game.title === 'Game 0',
    )

    expect(report.totalPlaytimeMinutes).toBe(296)
    expect(report.averagePlaytimeMinutesPerGame).toBeCloseTo(average, 2)
    expect(game1Exists).toBe(false)
  })

  test('Should return an empty recently played list when all sessions are older than 30 days', async () => {
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
    ])

    await PlaySessionModel.insertMany([
      {
        gameId: games[0]._id,
        durationMinutes: 1,
        playedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
      },
      {
        gameId: games[1]._id,
        durationMinutes: 1,
        playedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
      },
      {
        gameId: games[0]._id,
        durationMinutes: 1,
        playedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        gameId: games[1]._id,
        durationMinutes: 1,
        playedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      },
    ])

    const report = await playtimeReport.execute()

    expect(report.recentlyPlayedGames.count).toBe(0)
    expect(report.recentlyPlayedGames.games.length).toBe(0)
  })
})
