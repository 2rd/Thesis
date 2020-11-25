const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionnaireSchema = new Schema(
  {
    questionnaireId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    input: { type: String, required: false },
    questions: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = Questionnaire;
