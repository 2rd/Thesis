const router = require("express").Router();
let User = require("../models/user.model");
const { registrationValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { route } = require("./moviedata");

//VALIDATION

router.route("/").get((req, res) => {
  User.find()
    .then((Auths) => res.json(Auths))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/register").post(async (req, res) => {
  // Validation
  const { error } = registrationValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  const userExists = await User.findOne({ username: req.body.username });
  if (userExists) {
    return res.status(400).json("Username already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const username = req.body.username;
  const password = hashedPassword;

  const newAuth = new User({ username, password });

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
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json("Wrong username or password.");
  }
  //Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).json("Wrong username or password.");
  }

  //Create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
