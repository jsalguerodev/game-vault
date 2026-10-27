import { beforeAll, afterAll, beforeEach, describe, test, expect } from 'vitest'
import { PlatformReport } from '../../../../src/application/use-cases/index.js'
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
  addDefaultGameData,
  addDefaultPlatformData,
  addDefaultPlatformsGamesData,
} from '../../../helpers/mongodb-test.helper.js'
import { isObjectIdOrHexString } from 'mongoose'
import { normalize } from '../../../../src/config/plugins/index.js'
const reportRepository = new MongoReportRepository(
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
)
const platformReport = new PlatformReport(reportRepository)

describe('Platform Report', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  test('Should return zero platforms and an empty list when no data exists', async () => {
    const report = await platformReport.execute()

    expect(report.totalPlatforms).toBe(0)
    expect(report.platforms.length).toBe(0)
  })

  test('Should return the total number of registered platforms', async () => {
    await addDefaultPlatformData()
    const report = await platformReport.execute()

    expect(report.totalPlatforms).toBe(3)
  })

  test('Should return each platform with its identifier and name', async () => {
    await addDefaultPlatformData()

    const report = await platformReport.execute()

    const platform_1 = report.platforms[0]
    const platform_2 = report.platforms[1]
    const platform_3 = report.platforms[2]

    expect(isObjectIdOrHexString(platform_1.platformId)).toBe(true)
    expect(platform_1.platformName).toEqual('Platform 1')

    expect(isObjectIdOrHexString(platform_2.platformId)).toBe(true)
    expect(platform_2.platformName).toEqual('Platform 2')

    expect(isObjectIdOrHexString(platform_3.platformId)).toBe(true)
    expect(platform_3.platformName).toEqual('Platform 3')
  })

  test('Should count games assigned to each platform', async () => {
    await addDefaultPlatformsGamesData()

    const report = await platformReport.execute()

    const platform_1 = report.platforms[0]
    const platform_2 = report.platforms[1]
    const platform_3 = report.platforms[2]

    expect(platform_1.gameCount).toBe(2)
    expect(platform_3.gameCount).toBe(1)
  })

  test('Should include platforms without games with a zero game count', async () => {
    await addDefaultPlatformsGamesData()

    const report = await platformReport.execute()

    const platform_1 = report.platforms[0]
    const platform_2 = report.platforms[1]
    const platform_3 = report.platforms[2]

    expect(platform_2.gameCount).toBe(0)
  })

  test('Should sort platforms alphabetically by name', async () => {
    const platforms = await PlatformModel.insertMany([
      {
        name: 'Z - Platform',
        normalizedName: normalize('Z - Platform'),
      },
      {
        name: 'A - Platform',
        normalizedName: normalize('A - Platform'),
      },
      {
        name: 'H - Platform',
        normalizedName: normalize('H - Platform'),
      },
      {
        name: 'AC - Platform',
        normalizedName: normalize('AC - Platform'),
      },
      {
        name: 'AB - Platform',
        normalizedName: normalize('AB - Platform'),
      },
    ])

    const report = await platformReport.execute()

    const platform_1 = report.platforms[0]
    const platform_3 = report.platforms[2]
    const platform_5 = report.platforms[4]

    expect(platform_1.platformName).toBe('A - Platform')
    expect(platform_3.platformName).toBe('AC - Platform')
    expect(platform_5.platformName).toBe('Z - Platform')
  })

  test('Should group games without a platform under a null platform', async () => {
    await addDefaultPlatformsGamesData()
    await addDefaultGameData()

    const report = await platformReport.execute()

    const null_platform = report.platforms.find(
      (platform) => platform.platformId === null,
    )

    expect(null_platform).toBeDefined()
    expect(null_platform?.platformId).toBeNull()
    expect(null_platform?.platformName).toBeNull()
    expect(null_platform?.gameCount).toBe(3)
  })

  test('Should omit the null platform group when all games are assigned', async () => {
    await addDefaultPlatformsGamesData()

    const report = await platformReport.execute()

    const null_platform = report.platforms.find(
      (platform) => platform.platformId === null,
    )

    expect(report.totalPlatforms).toBe(3)
    expect(null_platform).toBeUndefined()
  })
})
