import mongoose from "mongoose"

const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },

  id: {
    type: String,
    default: ""
  },

  manufacturer: {
    type: String,
    trim: true,
    default: "",
    unique: true
  },

  type: {
    type: String,
    enum: ['console','handheld','pc','pc-storefront','other'],
    default: 'other'
  },

  releaseYear: {
    type: Number,
    default: null,
    min: 1,
    validate:{
      validator: (value: number | null): boolean => {
        return value === null || Number.isInteger(value)
      },
      message: 'Release year must be an integer'
    }
  }
},
  { timestamps: true, }
)

export const PlatformModel = mongoose.model( 'Platform', platformSchema )