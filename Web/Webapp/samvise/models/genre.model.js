const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const genreSchema = new Schema(
  {
    userId: { type: String, required: true },
    genres: { type: Array, required: true },
  },
  {
    timestamps: false,
  }
);

const Genres = mongoose.model("genres", genreSchema);

module.exports = Genres;
