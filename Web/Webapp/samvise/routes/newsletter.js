const router = require("express").Router();
let Newsletter = require("../models/newsletter.model");

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

router.route("/registeremail").post(async (req, res) => {
  const validEmail = validateEmail(req.body.email);
  if (!validEmail) {
    return res.status(400).json("Must enter a valid email address.");
  }
  const emailExists = await Newsletter.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).json("This email is already registered");
  }
  const email = req.body.email;
  const newEmail = new Newsletter({
    email,
  });

  newEmail
    .save()
    .then(() => res.json("Email registered"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
