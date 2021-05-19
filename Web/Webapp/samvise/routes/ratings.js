const router = require("express").Router();
let Rating = require("../models/rating.model");
const verify = require("./verifyToken");

router.route("/add").post(verify, (req, res) => {
  const userId = req.user;
  const movieId = String(req.body.movieId);
  //   const rating = Number(req.body.rating);
  //   const timespent = String(req.body.timespent);
  const newRating = new Rating({
    userId,
    movieId,
    // rating,
    // timespent,
  });

  newRating
    .save()
    .then(() => res.json("Rating added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update").post(verify, (req, res) => {
  Rating.findOne({
    userId: req.user._id,
    movieId: req.body.movieId,
  })
    .then((ratingReq) => {
      ratingReq.userId = req.user;
      ratingReq.movieId = String(req.body.movieId);
      ratingReq.rating = Number(req.body.rating);
      ratingReq.timespent = Number(req.body.timespent);

      ratingReq
        .save()
        .then(() => res.json("Rating updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
