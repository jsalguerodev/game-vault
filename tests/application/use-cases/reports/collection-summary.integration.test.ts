import { beforeAll, afterAll, beforeEach, describe, expect, test } from 'vitest'
import mongoose from 'mongoose'
import { GameModel, PlatformModel, PlaySessionModel, WishlistModel } from '../../../../src/infrastructure/database/mongodb/models/index.js'

import {
  connectTestDatabase,
  disconnectTestDatabase,
  clearTestDatabase,
} from '../../../helpers/mongodb-test.helper.js'

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

  test('Should return true', () => {
    expect(true).toBe(true)
  })
})