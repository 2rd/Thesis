const router = require("express").Router();
let Evaluation = require("../models/evaluation.model");

router.route("/").get((req, res) => {
  Evaluation.find()
    .then((evaluations) => res.json(evaluations))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const question1 = Number(req.body.question1);
  const question2 = Number(req.body.question2);
  const newEvaluation = new Evaluation({ username, question1, question2 });

  newEvaluation
    .save()
    .then(() => res.json("Evaluation added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
