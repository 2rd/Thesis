import { useEffect, useState, useContext } from "react";
import TmdbApi from "../helper/TmdbApi";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating/StarRating";
import Progressbar from "../components/Progressbar/Progressbar";
import { authContext } from "../contexts/AuthContext";
import * as axios from "axios";
import { InlineIcon } from "@iconify/react";
import menuDown from "@iconify/icons-mdi/menu-down";
import menuUp from "@iconify/icons-mdi/menu-up";

const Spinner = require("react-spinkit");

const Movie = ({ location, match }) => {
  const [api, setApi] = useState(null);
  const [currentMovie, setCurrentMovie] = useState(0);
  const [trailerFrame, setTrailerFrame] = useState(null);
  const [credits, setCredits] = useState(null);
  const [ratings, setRatings] = useState({});
  const [ratingArr, setRatingArr] = useState([]);
  const [isRated, setIsRated] = useState(false);
  const [wasFetched, setWasFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showMovieInfo, setShowMovieInfo] = useState(false);
  const [progress, setProgress] = useState(35);
  const [timeSpent, setTimeSpent] = useState(Date.now());
  const { auth } = useContext(authContext);

  useEffect(() => {
    if (wasFetched) {
      fetchCredits();
      fetchTrailer();
    } else {
      updateApi(currentMovie);
    }
  }, [wasFetched]);

  const updateApi = async (movieNumber) => {
    if (!wasFetched) {
      const api = new TmdbApi(
        location.state.movies[movieNumber].movieId,
        wasFetchedCallback
      );
      setApi(api);
    }
  };
  const fetchCredits = async () => {
    if (wasFetched && api.data.movieData.length !== 0) {
      const credits = await api.getCredits();
      setCredits(credits.data);
    }
  };

  const fetchTrailer = async () => {
    if (wasFetched && api.data.movieData.length !== 0) {
      const trailer = await api.getMovieTrailer();
      setTrailerFrame(createTrailerFrame(trailer));
    }
  };

  const createTrailerFrame = (trailer) => {
    const trailerKey =
      trailer.data.results.length > 0
        ? trailer.data.results[0].key
        : "undefined";
    return (
      <iframe src={`https://www.youtube.com/embed/${trailerKey}`}></iframe>
    );
  };

  const onNextClick = () => {
    if (isRated) {
      postRating(currentMovie, timeSpent);
      setIsRated(false);
      const nextMovie = currentMovie + 1;
      setCurrentMovie(nextMovie);
      setWasFetched(false);
      setErrorMessage(null);
      setProgress(progress + 1.67);
      setTimeSpent(Date.now());
    } else {
      setErrorMessage("Please rate the movie to continue");
    }
  };

  const postRating = async (movie, time) => {
    const rating = {
      movieId: Object.entries(ratingArr[movie])[0][0],
      rating: Object.entries(ratingArr[movie])[0][1],
      timespent: Date.now() - time,
    };

    try {
      const res = await axios.post("/ratings/update", rating, {
        headers: { "auth-token": auth.data },
      });
    } catch (err) {
      console.log(err.response.data);
      // setErrorMessage(err.response.data);
    }
    // console.log(ratings);
  };

  const movieCredits = () => {
    const cast = credits.cast
      .slice(0, 3)
      .map((actor) => <li key={actor.name}>{actor.name}</li>);
    const directors = getDirector().map((director) => (
      <li key={director}>{director}</li>
    ));
    return (
      <div className="grid-container halves">
        <div>
          <h6>Cast:</h6>
          <ul>{cast}</ul>
        </div>
        <div>
          <h6>Director:</h6>
          <ul>{directors}</ul>
        </div>
      </div>
    );
  };

  const getDirector = () => {
    let directors = [];
    for (let member of credits.crew) {
      if (member.job === "Director") {
        directors.push(member.name);
      }
    }
    return directors;
  };

  const movieInfo = () => {
    return (
      <div>
        <h4 className="movieTitle">{`${api.data.movieData.title} (${api.data.movieData.release_date})`}</h4>
        <div>{api.data.movieData.overview}</div>
      </div>
    );
  };

  const ratingCallback = (rating) => {
    let updatedRatings = ratings;
    updatedRatings[api.data.movieData.movieId] = parseInt(rating);

    let updatedRatingArr = ratingArr;
    let ratingObj = {};
    ratingObj[api.data.movieData.movieId] = parseInt(rating);
    updatedRatingArr.push(ratingObj);
    setRatingArr(updatedRatingArr);
    setRatings(updatedRatings);
    setIsRated(true);
  };

  const wasFetchedCallback = (fetched) => {
    setWasFetched(fetched);
  };

  const next = () => {
    return (
      <div className="nextBtnContainer">
        {currentMovie < location.state.movies.length - 1 ? (
          <button onClick={() => onNextClick()}>Next</button>
        ) : isRated ? (
          <Link
            to={{ pathname: "/recommendations", state: { ratings: ratings } }}
          >
            <button onClick={() => postRating(currentMovie, timeSpent)}>
              Next
            </button>
          </Link>
        ) : (
          <button
            onClick={() => setErrorMessage("Please rate the movie to continue")}
          >
            Next
          </button>
        )}
      </div>
    );
  };

  return wasFetched ? (
    api.data.movieData.length !== 0 ? (
      <div>
        <Progressbar progress={progress} />
        <div className="grid-container full narrow">
          <div>
            <h4 className="noPadding noMargin">Please rate the movie</h4>
            <p>Rate the movie from 1-5 by clicking on the stars below</p>
          </div>
          <div className="iframeContainer">{trailerFrame}</div>

          <StarRating ratingCallback={ratingCallback} key={currentMovie} />

          <h4 className="movieTitle">{`${api.data.movieData.title} (${api.data.movieData.release_date})`}</h4>

          {!showMovieInfo ? (
            <a onClick={() => setShowMovieInfo(true)}>
              Show movie info <InlineIcon icon={menuDown} />
            </a>
          ) : (
            <div>
              <div>{api.data.movieData.overview}</div>
              {credits !== null ? movieCredits() : <div></div>}
              <a onClick={() => setShowMovieInfo(false)}>
                Hide movie info
                <InlineIcon icon={menuUp} />
              </a>
            </div>
          )}
        </div>
        <div className="space-bottom100"></div>
        <div className="bottom-container">
          <div className="errorMessage">{errorMessage}</div>
          {next()}
        </div>
      </div>
    ) : (
      <div>
        <p>An error occured - please click "next" to skip this section.</p>
        <Link to="/sus">
          <button>Next</button>
        </Link>
      </div>
    )
  ) : (
    <div style={{ marginTop: "10%" }}>
      <Progressbar progress={progress} />
      <div className="spinnerContainer">
        <Spinner name="ball-grid-beat" color="#469580" fadeIn="full" />
      </div>
    </div>
  );
};

export default Movie;
