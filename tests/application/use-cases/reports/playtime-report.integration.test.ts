import { beforeAll, afterAll, beforeEach, describe, test } from 'vitest'

import {
  connectTestDatabase,
  disconnectTestDatabase,
  clearTestDatabase,
} from '../../../helpers/mongodb-test.helper.js'

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

  test.todo('Should return an empty playtime report when no play sessions exist')
  test.todo('Should sum playtime across all play sessions')
  test.todo('Should calculate average playtime per game using each game total')
  test.todo('Should exclude games without play sessions from average playtime')
  test.todo('Should round average playtime to two decimal places')
  test.todo('Should return the most played game with its identifier, title, and total playtime')
  test.todo('Should combine multiple sessions for the same game when selecting the most played game')
  test.todo('Should include games played within the last 30 days in recently played games')
  test.todo('Should include play sessions exactly at the 30 day cutoff')
  test.todo('Should exclude older sessions from recently played totals while including them in overall totals')
  test.todo('Should count each recently played game once and sum its recent sessions')
  test.todo('Should return an empty recently played list when all sessions are older than 30 days')
})
