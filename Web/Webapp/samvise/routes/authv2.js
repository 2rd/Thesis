const router = require("express").Router();
let User = require("../models/userv2.model");
const { registrationValidation, loginValidation } = require("../validationv2");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const mongoose = require("mongoose");

const { route } = require("./moviedata");

//VALIDATION

// router.route("/").get((req, res) => {
//   User.find()
//     .then((Auths) => res.json(Auths))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

router.route("/register").post(async (req, res) => {
  // Validation
  const { error } = registrationValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  const userId = req.body.userId;

  const newAuth = new User({ userId });

  newAuth
    .save()
    .then(() => res.json("User added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/login").post(async (req, res) => {
  // Validation
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  const user = await User.findOne({ userId: req.body.userId });
  if (!user) {
    return res.status(400).json("Failed to log in..");
  }

  //Create and assign token
  // _id as user token
  // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  // res.header("auth-token", token).send(token);

  // userId as user token
  const token = jwt.sign({ _id: user.userId }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

router.route("/update").post(verify, (req, res) => {
  User.findOne({ userId: mongoose.Types.ObjectId(req.user._id) })
    .then((userReq) => {
      userReq.progress = String(req.body.progress);
      userReq.user = String(req.user);
      userReq.completionTime = Number(req.body.completionTime);
      userReq
        .save()
        .then(() => res.json("progress/timespent updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
