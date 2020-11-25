const router = require("express").Router();
let Answer = require("../models/answer.model");

router.route("/").get((req, res) => {
  Answer.find()
    .then((answers) => res.json(answers))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  const questionnaireId = Number(req.body.questionnaireId);
  const questionKey = Number(req.body.questionKey);
  const answer = String(req.body.answer);
  const newAnswer = new Answer({
    userId,
    questionnaireId,
    questionKey,
    answer,
  });

  newAnswer
    .save()
    .then(() => res.json("Answer added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
