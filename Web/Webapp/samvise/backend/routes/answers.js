const router = require("express").Router();
let Answer = require("../models/answer.model");
const verify = require("./verifyToken");

// router.route("/").get(verify, (req, res) => {
//   Answer.find()
//     .then((answers) => res.json(answers))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

router.route("/add").post(verify, (req, res) => {
  const userId = req.user;
  const questionnaireId = String(req.body.questionnaireId);
  const answers = Object(req.body.answers);
  const newAnswer = new Answer({
    userId,
    questionnaireId,
    answers,
  });

  newAnswer
    .save()
    .then(() => res.json("Answer added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:questionnaireId").post(verify, (req, res) => {
  Answer.findOne({
    userId: req.user._id,
    questionnaireId: req.params.questionnaireId,
  })
    .then((answer) => {
      answer.userId = req.user;
      answer.questionnaireId = String(req.params.questionnaireId);
      answer.answers = Object(req.body.answers);
      answer
        .save()
        .then(() => res.json("Answer updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
