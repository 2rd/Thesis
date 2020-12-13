const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema(
  {
    userId: { type: String, required: true },
    questionnaireId: { type: String, required: true },
    answers: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
