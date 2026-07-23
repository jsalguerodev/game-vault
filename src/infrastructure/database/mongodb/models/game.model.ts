import mongoose from "mongoose"

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },

  platformId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Platform",
    required: true
  },

  format: {
    type: String,
    enum: ['digital', 'physical'],
    required: true
  },

  id: {
    type: String,
    default: ""
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
  },

  edition: {
    type: String,
    trim: true,
    default: 'standard'
  },

  genres: {
    type: [{
            type: String,
            trim: true,
          }],
    default: [],
  },

  notes: {
    type: String,
    default: ""
  }
},
  { timestamps: true, }
)

export const GameModel = mongoose.model( 'Game', gameSchema )