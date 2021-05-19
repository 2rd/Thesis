const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    userId: { type: String, required: true },
    movieId: { type: String, required: true },
    rating: { type: Number, required: false },
    timespent: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
