const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const evaluationSchema = new Schema(
  {
    username: { type: String, required: true },
    question1: { type: Number, required: true },
    question2: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

module.exports = Evaluation;
