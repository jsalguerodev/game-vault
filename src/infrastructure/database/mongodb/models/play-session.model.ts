import mongoose from 'mongoose'

export interface PlaySessionPersistence {
  _id: mongoose.Types.ObjectId
  gameId: mongoose.Types.ObjectId
  playedAt: Date
  durationMinutes: number
  notes: string
  createdAt: Date
  updatedAt: Date
}

const playSessionSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    playedAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: (value: number | null): boolean => {
          return value === null || Number.isInteger(value)
        },
        message: 'Duration must be an integer',
      },
    },
    notes: {
      type: String,
      required: false,
      default: '',
    },
  },
  { timestamps: true },
)

export const PlaySessionModel = mongoose.model<PlaySessionPersistence>(
  'PlaySession',
  playSessionSchema,
)
