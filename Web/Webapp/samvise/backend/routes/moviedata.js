const router = require("express").Router();
let Moviedata = require("../models/moviedata.model");

router.route("/").get((req, res) => {
  Moviedata.find()
    .then((moviedata) => res.json(moviedata))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:movieId").get((req, res) => {
  Moviedata.findOne({ movieId: parseInt(req.params.movieId) })
    .then((moviedata) => res.json(moviedata))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const movieId = req.body.movieId;
  const genres = Number(req.body.genres);
  const imdbId = Number(req.body.imdbId);
  const newMovieData = new Moviedata({ movieId, genres, imdbId });

  newMovieData
    .save()
    .then(() => res.json("Moviedata added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
