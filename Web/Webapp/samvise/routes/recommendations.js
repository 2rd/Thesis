const router = require("express").Router();
const Recommendations = require("../models/recommendations.model");
const verify = require("./verifyToken");

router.route("/add").post(verify, (req, res) => {
  const userId = req.user;
  const recommendations = Object(req.body.recommendations);

  const newRecs = new Recommendations({
    userId,
    recommendations,
  });

  newRecs
    .save()
    .then(() => res.json("Recommendations added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
