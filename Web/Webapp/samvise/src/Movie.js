import { useEffect, useState } from "react";
import TmdbApi from "./helper/TmdbApi";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const Movie = ({ location, match }) => {
  const [api, setApi] = useState(null);
  const [currentMovie, setCurrentMovie] = useState(0);
  const [trailerFrame, setTrailerFrame] = useState(null);
  const [credits, setCredits] = useState(null);
  const [ratings, setRatings] = useState({});
  const [isRated, setIsRated] = useState(false);
  const [wasFetched, setWasFetched] = useState(false);

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
    if (wasFetched) {
      const credits = await api.getCredits();
      setCredits(credits.data);
    }
  };

  const fetchTrailer = async () => {
    const trailer = await api.getMovieTrailer();
    setTrailerFrame(createTrailerFrame(trailer));
  };

  const createTrailerFrame = (trailer) => {
    const trailerKey = trailer.data.results[0].key;
    return (
      <iframe src={`https://www.youtube.com/embed/${trailerKey}`}></iframe>
    );
  };

  const onNextClick = () => {
    if (isRated) {
      setIsRated(false);
      const nextMovie = currentMovie + 1;
      setCurrentMovie(nextMovie);
      setWasFetched(false);
    } else {
      console.log("Must provide a rating to proceed");
    }
  };

  const movieCredits = () => {
    const cast = credits.cast
      .slice(0, 3)
      .map((actor) => <li key={actor.name}>{actor.name}</li>);
    const directors = getDirector().map((director) => (
      <li key={director}>{director}</li>
    ));
    return (
      <div>
        <h6>Cast:</h6>
        <ul>{cast}</ul>
        <h6>Director:</h6>
        <ul>{directors}</ul>
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
        <h4>{`${api.data.movieData.title} (${api.data.movieData.release_date})`}</h4>
        <div>{api.data.movieData.overview}</div>
      </div>
    );
  };

  const ratingCallback = (rating) => {
    let updatedRatings = ratings;

    updatedRatings[api.data.movieData.movieId] = parseInt(rating);
    setRatings(updatedRatings);
    setIsRated(true);
  };

  const wasFetchedCallback = (fetched) => {
    setWasFetched(fetched);
  };

  const next = () => {
    return (
      <div>
        {currentMovie < location.state.movies.length - 1 ? (
          <button onClick={() => onNextClick()}>Next</button>
        ) : isRated ? (
          <Link
            to={{ pathname: "/recommendations", state: { ratings: ratings } }}
          >
            Continue
          </Link>
        ) : (
          <p>Continue</p>
        )}
      </div>
    );
  };

  return wasFetched ? (
    <div className="grid-container full">
      <div className="container">{trailerFrame}</div>
      <h6>Your rating:</h6>
      <StarRating ratingCallback={ratingCallback} key={currentMovie} />
      {movieInfo()}
      {credits !== null ? movieCredits() : <div></div>}

      {next()}
    </div>
  ) : (
    <div>LOADING</div>
  );
};

export default Movie;
