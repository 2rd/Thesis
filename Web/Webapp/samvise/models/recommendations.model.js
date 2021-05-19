const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recommendationsSchema = new Schema(
  {
    userId: { type: String, required: true },
    recommendations: { type: Object, required: true },
  },
  {
    timestamps: false,
  }
);

const Recommendations = mongoose.model(
  "Recommendations",
  recommendationsSchema
);

module.exports = Recommendations;
