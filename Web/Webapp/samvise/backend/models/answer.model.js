const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema(
  {
    userId: { type: String, required: true },
    questionnaireId: { type: String, required: true },
    questionKey: { type: Number, required: true },
    answer: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
