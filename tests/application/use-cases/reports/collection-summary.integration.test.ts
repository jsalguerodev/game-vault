import { beforeAll, afterAll, beforeEach, describe, test } from 'vitest'

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

  test.todo('Should return zero totals when the collection is empty')
  test.todo('Should return the total number of games in the collection')
  test.todo('Should count games grouped by each status')
  test.todo('Should return zero for statuses without games')
  test.todo('Should exclude wishlist items from the collection totals')
  test.todo('Should reflect game status changes in the status counts')
  test.todo('Should reflect deleted games in the collection totals')
})
