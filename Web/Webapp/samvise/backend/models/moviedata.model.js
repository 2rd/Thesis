const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieDataSchema = new Schema(
  {
    movieId: { type: Number, required: true },
    genres: { type: Array, required: true },
    imdbId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
movieDataSchema.set("collection", "moviedata");

const movieData = mongoose.model("movieData", movieDataSchema);

module.exports = movieData;
