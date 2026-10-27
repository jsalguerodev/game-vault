import { beforeAll, afterAll, beforeEach, describe, test } from 'vitest'

import {
  connectTestDatabase,
  disconnectTestDatabase,
  clearTestDatabase,
} from '../../../helpers/mongodb-test.helper.js'

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

  test.todo(
    'Should return zero totals and null averages when the wishlist is empty',
  )
  test.todo('Should return the total number of wishlist items')
  test.todo('Should count wishlist items grouped by each priority')
  test.todo('Should return zero for priorities without wishlist items')
  test.todo('Should calculate the average target price excluding null values')
  test.todo(
    'Should calculate the average target discount excluding null values',
  )
  test.todo(
    'Should round target price and discount averages to two decimal places',
  )
  test.todo(
    'Should count items with a target price and items with a target discount separately',
  )
  test.todo(
    'Should include zero target prices and discounts in counts and averages',
  )
  test.todo(
    'Should return null averages when no items have target prices or discounts',
  )
})
