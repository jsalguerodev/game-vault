import { normalize } from '../../../../config/plugins/index.js'
import mongoose from 'mongoose'
import type {
  GameFormat,
  GameStatus,
} from '../../../../domain/entities/index.js'

export interface GamePersistence {
  _id: mongoose.Types.ObjectId
  title: string
  normalizedTitle: string
  platformId: mongoose.Types.ObjectId | null
  format: GameFormat
  developer: string
  normalizedDeveloper: string
  publisher: string
  normalizedPublisher: string
  releaseYear: number | null
  edition: string
  genres: string[]
  notes: string
  status: GameStatus
  completedAt: Date | null
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
      validate: {
        validator: function (value: string): boolean {
          return value === normalize(this.title)
        },
        message: 'normalizedTitle is inconsistent with title',
      },
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

    normalizedDeveloper: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (value: string): boolean {
          return value === normalize(this.developer)
        },
        message: 'normalizedDeveloper is inconsistent with developer',
      },
    },

    publisher: {
      type: String,
      trim: true,
      default: '',
    },

    normalizedPublisher: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (value: string): boolean {
          return value === normalize(this.publisher)
        },
        message: 'normalizedPublisher is inconsistent with publisher',
      },
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

    status: {
      type: String,
      enum: [
        'backlog',
        'playing',
        'paused',
        'completed',
        'dropped',
        'cataloged',
      ],
      required: true,
      default: 'cataloged',
    },

    completedAt: {
      type: Date,
      default: null,
      required: function (this: GamePersistence): boolean {
        return this.status === 'completed'
      },
      validate: {
        validator: function (
          this: GamePersistence,
          value: Date | null,
        ): boolean {
          return value === null || this.status === 'completed'
        },
        message: 'completedAt can only have a value when status is completed',
      },
    },
  },
  { timestamps: true },
)

export const GameModel = mongoose.model<GamePersistence>('Game', gameSchema)
