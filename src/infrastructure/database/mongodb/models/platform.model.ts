import mongoose from 'mongoose'
import type { PlatformType } from '../../../../domain/entities/index.js'

export interface PlatformPersistence {
  _id: mongoose.Types.ObjectId
  name: string
  normalizedName: string
  manufacturer: string
  normalizedManufacturer: string
  type: PlatformType
  releaseYear: number | null
  createdAt: Date
  updatedAt: Date
}

const platformSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    normalizedName: {
      type: String,
      trim: true,
      required: true,
    },

    manufacturer: {
      type: String,
      trim: true,
      default: '',
    },

    normalizedManufacturer: {
      type: String,
      trim: true,
      default: '',
    },

    type: {
      type: String,
      enum: ['console', 'handheld', 'pc', 'pc-storefront', 'other'],
      default: 'other',
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
  },
  { timestamps: true },
)

platformSchema.index(
  { normalizedName: 1, normalizedManufacturer: 1 },
  { unique: true },
)

export const PlatformModel = mongoose.model<PlatformPersistence>(
  'Platform',
  platformSchema,
)
