const router = require("express").Router();
let Questionnaire = require("../models/questionnaire.model");

router.route("/").get((req, res) => {
  Questionnaire.find()
    .then((questionnaires) => res.json(questionnaires))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:questionnaireId").get((req, res) => {
  Questionnaire.findOne({ questionnaireId: req.params.questionnaireId })
    .then((questionnaire) => res.json(questionnaire))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
