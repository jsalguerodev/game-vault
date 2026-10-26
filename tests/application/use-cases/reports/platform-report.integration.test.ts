import { beforeAll, afterAll, beforeEach, describe, test } from 'vitest'

import {
  connectTestDatabase,
  disconnectTestDatabase,
  clearTestDatabase,
} from '../../../helpers/mongodb-test.helper.js'

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

  test.todo('Should return zero platforms and an empty list when no data exists')
  test.todo('Should return the total number of registered platforms')
  test.todo('Should return each platform with its identifier and name')
  test.todo('Should count games assigned to each platform')
  test.todo('Should include platforms without games with a zero game count')
  test.todo('Should sort platforms alphabetically by name')
  test.todo('Should group games without a platform under a null platform')
  test.todo('Should omit the null platform group when all games are assigned')
  test.todo('Should exclude the null platform group from the total platform count')
})
