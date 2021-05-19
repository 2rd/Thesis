const router = require("express").Router();
const Genres = require("../models/genre.model");
const verify = require("./verifyToken");

router.route("/add").post(verify, (req, res) => {
  const userId = req.user;
  const genres = Array(req.body.genres);

  const newRecs = new Genres({
    userId,
    genres,
  });

  newRecs
    .save()
    .then(() => res.json("Genres added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
