import { beforeAll, afterAll, beforeEach, describe, test, expect } from 'vitest'
import { WishlistReport } from '../../../../src/application/use-cases/index.js'
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
  addDefaultWishlistEntriesData,
} from '../../../helpers/mongodb-test.helper.js'
import { normalize } from '../../../../src/config/plugins/index.js'

const reportRepository = new MongoReportRepository(
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
)

const wishlistReport = new WishlistReport(reportRepository)

describe('Wishlist Report', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  test('Should return zero totals and null averages when the wishlist is empty', async () => {
    const report = await wishlistReport.execute()

    expect(report.totalItems).toBe(0)
    expect(report.byPriority.low).toBe(0)
    expect(report.byPriority.medium).toBe(0)
    expect(report.byPriority.high).toBe(0)
    expect(report.averageTargetDiscount).toBeNull()
    expect(report.averageTargetPrice).toBeNull()
    expect(report.itemsWithTargetDiscount).toBe(0)
    expect(report.itemsWithTargetPrice).toBe(0)
  })

  test('Should return the total number of wishlist items', async () => {
    await addDefaultWishlistEntriesData()

    const report = await wishlistReport.execute()

    expect(report.totalItems).toBe(4)
  })

  test('Should count wishlist items grouped by each priority', async () => {
    await addDefaultWishlistEntriesData()

    const report = await wishlistReport.execute()

    expect(report.byPriority.low).toBe(1)
    expect(report.byPriority.medium).toBe(2)
    expect(report.byPriority.high).toBe(1)
  })

  test('Should return zero for priorities without wishlist items', async () => {
    await WishlistModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        targetDiscount: 80,
        priority: 'high',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        targetPrice: 25,
        priority: 'low',
      },
    ])

    const report = await wishlistReport.execute()

    expect(report.byPriority.medium).toBe(0)
  })

  test('Should calculate the average target price excluding null values', async () => {
    await addDefaultWishlistEntriesData()

    const report = await wishlistReport.execute()

    expect(report.averageTargetPrice).toBe(27.5)
  })

  test('Should calculate the average target discount excluding null values', async () => {
    await addDefaultWishlistEntriesData()

    const report = await wishlistReport.execute()

    expect(report.averageTargetDiscount).toBe(47.5)
  })

  test('Should round target price and discount averages to two decimal places', async () => {
    await WishlistModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        targetDiscount: 10,
        targetPrice: 10,
        priority: 'high',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        targetPrice: 20,
        targetDiscount: 20,
        priority: 'low',
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        targetPrice: 25,
        targetDiscount: 25,
        priority: 'low',
      },
    ])

    const report = await wishlistReport.execute()

    expect(report.averageTargetPrice).toBe(18.33)
    expect(report.averageTargetDiscount).toBe(18.33)
  })

  test('Should count items with a target price and items with a target discount separately', async () => {
    await WishlistModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        targetDiscount: 80,
        priority: 'high',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
        targetPrice: 25,
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        format: 'physical',
        targetPrice: 30,
      },
    ])

    const report = await wishlistReport.execute()

    expect(report.itemsWithTargetDiscount).toBe(1)
    expect(report.itemsWithTargetPrice).toBe(2)
  })

  test('Should return null averages when no items have target prices or discounts', async () => {
    await WishlistModel.insertMany([
      {
        title: 'Game 1',
        normalizedTitle: normalize('Game 1'),
        priority: 'high',
      },
      {
        title: 'Game 2',
        normalizedTitle: normalize('Game 2'),
      },
      {
        title: 'Game 3',
        normalizedTitle: normalize('Game 3'),
        format: 'physical',
      },
    ])

    const report = await wishlistReport.execute()

    expect(report.averageTargetDiscount).toBeNull()
    expect(report.averageTargetPrice).toBeNull()
  })
})
