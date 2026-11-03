import { MongoDatabase } from '../../src/infrastructure/database/mongodb/connection.js'
import { envs } from '../../src/config/plugins/index.js'
import {
  GameModel,
  PlatformModel,
  PlaySessionModel,
  WishlistModel,
} from '../../src/infrastructure/database/mongodb/models/index.js'
import mongoose from 'mongoose'

import { normalize } from '../../src/config/plugins/index.js'

export const connectTestDatabase = async (): Promise<void> => {
  if (envs.MONGO_DB_NAME !== 'gamevault_test') {
    throw new Error('Tests must use the gamevault_test database')
  }

  await MongoDatabase.connect({
    mongodbUrl: envs.MONGO_URL,
    databaseName: envs.MONGO_DB_NAME,
    serverSelectionTimeoutMs: 5000,
  })
}

export const disconnectTestDatabase = async (): Promise<void> => {
  await MongoDatabase.disconnect()
}

export const clearTestDatabase = async (): Promise<void> => {
  const db = mongoose.connection.db

  if (!db || db.databaseName !== 'gamevault_test') {
    throw new Error('Database cleanup is only allowed on gamevault_test')
  }

  await GameModel.deleteMany({})
  await PlatformModel.deleteMany({})
  await PlaySessionModel.deleteMany({})
  await WishlistModel.deleteMany({})
}

export const addDefaultGameData = async (): Promise<void> => {
  await GameModel.insertMany([
    {
      title: 'Game 1',
      normalizedTitle: normalize('Game 1'),
      status: 'playing',
      format: 'digital',
      genres: ['RPG'],
    },
    {
      title: 'Game 2',
      normalizedTitle: normalize('Game 2'),
      status: 'backlog',
      format: 'physical',
      genres: ['RPG', 'Adventure', 'Tactical'],
    },
    {
      title: 'Game 3',
      normalizedTitle: normalize('Game 3'),
      status: 'cataloged',
      format: 'physical',
      genres: ['Driving', 'Simulation', 'Sports'],
    },
  ])
}

export const addDefaultPlatformData = async (): Promise<void> => {
  await PlatformModel.insertMany([
    {
      name: 'Platform 1',
      normalizedName: normalize('Platform 1'),
    },
    {
      name: 'Platform 2',
      normalizedName: normalize('Platform 2'),
    },
    {
      name: 'Platform 3',
      normalizedName: normalize('Platform 3'),
    },
  ])
}

export const addDefaultPlatformsGamesData = async (): Promise<void> => {
  const platforms = await PlatformModel.insertMany([
    {
      name: 'Platform 1',
      normalizedName: normalize('Platform 1'),
    },
    {
      name: 'Platform 2',
      normalizedName: normalize('Platform 2'),
    },
    {
      name: 'Platform 3',
      normalizedName: normalize('Platform 3'),
    },
  ])

  await GameModel.insertMany([
    {
      title: 'Game 1',
      normalizedTitle: normalize('Game 1'),
      status: 'playing',
      format: 'digital',
      platformId: platforms[0]._id,
    },
    {
      title: 'Game 2',
      normalizedTitle: normalize('Game 2'),
      status: 'backlog',
      format: 'physical',
      platformId: platforms[0]._id,
    },
    {
      title: 'Game 3',
      normalizedTitle: normalize('Game 3'),
      status: 'cataloged',
      format: 'physical',
      platformId: platforms[2]._id,
    },
  ])
}

export const addDefaultPlaytimeSessions = async (): Promise<void> => {
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
    {
      title: 'Game 4',
      normalizedTitle: normalize('Game 4'),
      status: 'cataloged',
      format: 'physical',
    },
  ])

  const sessions = await PlaySessionModel.insertMany([
    {
      gameId: games[0]._id,
      durationMinutes: 100,
      playedAt: new Date('2023-10-28'),
    },
    {
      gameId: games[1]._id,
      durationMinutes: 35,
      playedAt: new Date('2024-10-28'),
    },
    {
      gameId: games[1]._id,
      durationMinutes: 22,
      playedAt: new Date('2024-10-29'),
    },
    {
      gameId: games[2]._id,
      durationMinutes: 100,
      playedAt: new Date(),
    },
    {
      gameId: games[2]._id,
      durationMinutes: 20,
      playedAt: new Date(),
    },
    {
      gameId: games[2]._id,
      durationMinutes: 7,
      playedAt: new Date(),
    },
    {
      gameId: games[0]._id,
      durationMinutes: 11,
      playedAt: new Date('2026-10-28'),
    },
    {
      gameId: games[0]._id,
      durationMinutes: 1,
      playedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
    },
  ])
}

export const addDefaultWishlistEntriesData = async (): Promise<void> => {
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
    {
      title: 'Game 4',
      normalizedTitle: normalize('Game 4'),
      format: 'digital',
      targetDiscount: 15,
      priority: 'low',
    },
  ])
}

export const addDefaultCompletionData = async (): Promise<void> => {
  await addDefaultGameData()

  await GameModel.insertMany([
    {
      title: 'Game 10',
      normalizedTitle: normalize('Game 10'),
      status: 'completed',
      completedAt: new Date('12-12-2024'),
      format: 'digital',
      genres: ['RPG'],
    },
    {
      title: 'Game 11',
      normalizedTitle: normalize('Game 11'),
      status: 'completed',
      completedAt: new Date(),
      format: 'physical',
      genres: ['RPG', 'Adventure', 'Tactical'],
    },
    {
      title: 'Game 12',
      normalizedTitle: normalize('Game 12'),
      format: 'physical',
      genres: ['Driving', 'Simulation', 'Sports'],
    },
    {
      title: 'Game 13',
      normalizedTitle: normalize('Game 13'),
      status: 'completed',
      completedAt: new Date(new Date().getFullYear(), 0, 1),
      format: 'digital',
      genres: ['Driving', 'Simulation', 'Sports'],
    },
  ])
}

export const addDefaultCompletionDataWithSessions = async (): Promise<void> => {
  await addDefaultCompletionData()
  await addDefaultPlaytimeSessions()

  const games = await GameModel.find()

  await PlaySessionModel.create(
    {
      gameId: games[0]._id,
      durationMinutes: 60,
      playedAt: new Date('2023-10-28'),
    },
    {
      gameId: games[0]._id,
      durationMinutes: 70,
      playedAt: new Date('2023-10-28'),
    },
    {
      gameId: games[3]._id,
      durationMinutes: 35,
      playedAt: new Date('2023-10-28'),
    },
    {
      gameId: games[4]._id,
      durationMinutes: 100,
      playedAt: new Date('2023-10-28'),
    },
    {
      gameId: games[4]._id,
      durationMinutes: 25,
      playedAt: new Date('2023-10-29'),
    },
    {
      gameId: games[4]._id,
      durationMinutes: 127,
      playedAt: new Date('2023-10-30'),
    },
  )
}
