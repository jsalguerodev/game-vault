import mongoose from 'mongoose'
import type { GameFormat } from '../../../../domain/entities/index.js'

export interface GamePersistence {
  _id: mongoose.Types.ObjectId
  title: string
  normalizedTitle: string
  platformId: mongoose.Types.ObjectId | null
  format: GameFormat
  developer: string
  publisher: string
  releaseYear: number | null
  edition: string
  genres: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },

    normalizedTitle: {
      type: String,
      trim: true,
      required: true,
    },

    platformId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Platform',
      required: false,
      default: null,
    },

    format: {
      type: String,
      enum: ['digital', 'physical'],
      required: true,
    },

    developer: {
      type: String,
      trim: true,
      default: '',
    },

    publisher: {
      type: String,
      trim: true,
      default: '',
    },

    releaseYear: {
      type: Number,
      default: null,
      min: 1,
      validate: {
        validator: (value: number | null): boolean => {
          return value === null || Number.isInteger(value)
        },
        message: 'Release year must be an integer',
      },
    },

    edition: {
      type: String,
      trim: true,
      default: 'standard',
    },

    genres: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
)

export const GameModel = mongoose.model<GamePersistence>('Game', gameSchema)
