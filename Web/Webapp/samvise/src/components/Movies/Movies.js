import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TmdbApi from "../../helper/TmdbApi";

const { default: MovieCard } = require("../MovieCard/MovieCard");

const Movies = ({ match }) => {
  const [genreMovies, setGenreMovies] = useState([]);
  const [moviesToShow, setMoviesToShow] = useState([]);
  const [decadeMovies, setDecadeMovies] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [wasLoaded, setWasLoaded] = useState(false);
  const [currentlast, setCurrentLast] = useState(0);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [tmdbLoaded, setTmdbLoaded] = useState(false);
  const [sortedBy, setSortedBy] = useState("Sort by:");
  const [currentDecade, setCurrentDecade] = useState("all");
  const Spinner = require("react-spinkit");

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (wasLoaded && !tmdbLoaded) {
      fetchTmdbData();
    }
  }, [wasLoaded]);

  useEffect(() => {}, [sortedBy]);

  const fetchTmdbData = () => {
    const movies = [...genreMovies];
    const moviesUpdated = [];
    for (let movie of movies) {
      let fetchMovieData = new TmdbApi(movie.movieId, wasFetchedCallback);
      movie.api = fetchMovieData;
      moviesUpdated.push(movie);
    }
    setGenreMovies(moviesUpdated);
    setMoviesToShow(moviesUpdated);
  };

  // const updateGenreMovies = (movie) => {
  //   const movies = [...genreMovies];
  //   movies.push(movie);
  //   return movies;
  // };

  const wasFetchedCallback = (fetched) => {
    setTmdbLoaded(fetched);
  };

  const fetchMovies = async () => {
    const fetchMovies = await axios.get("http://localhost:5000/moviedata");
    const movies = fetchGenreMovies(
      fetchMovies.data,
      match.params.genres.split(",")
    );

    setGenreMovies(movies);
    setMoviesToShow(movies);
    setCurrentMovies(movies.slice(0, 9));
    setCurrentLast(9);
    setWasLoaded(true);
  };

  const fetchGenreMovies = (movies, genres) => {
    let genreMovies = [];
    for (let movie of Object.entries(movies)) {
      for (let genre of genres) {
        if (movie[1]["genres"].includes(genre)) {
          genreMovies.push(movie[1]);
          break;
        }
      }
    }
    return genreMovies;
  };

  const onClickedMore = () => {
    setCurrentMovies(moviesToShow.slice(currentlast, currentlast + 9));
    setCurrentLast(currentlast + 9);
  };
  const onClickedMovie = (movieData) => {
    if (!checkSelected(movieData)) {
      const selectedUpdated = getUpdatedSelectedMovies(
        selectedMovies,
        movieData,
        false
      );
      setSelectedMovies(selectedUpdated);
    } else {
      const selectedUpdated = getUpdatedSelectedMovies(
        selectedMovies,
        movieData,
        true
      );
      setSelectedMovies(selectedUpdated);
    }
  };

  const getUpdatedSelectedMovies = (selectedMovies = [], movie, selected) => {
    const movies = [...selectedMovies];
    if (!selected) {
      movies.push(movie);
    } else {
      for (let m of movies) {
        if (m.movieId === movie.movieId) {
          let index = movies.indexOf(m);
          if (index !== -1) {
            movies.splice(index, 1);
          }
        }
      }
    }
    return movies;
  };

  const getSelectedTitles = () => {
    const selected = selectedMovies.map((movie) => (
      <li key={movie.title}>
        <img
          alt={movie.title}
          src={`http://image.tmdb.org/t/p/w92${movie.poster_path}`}
        ></img>
      </li>
    ));
    return selected;
  };

  const checkSelected = (movie) => {
    if (selectedMovies.length > 0) {
      for (let m of selectedMovies) {
        if (m.movieId === movie.movieId) {
          return true;
        }
      }
    }

    return false;
  };

  const movieCards = currentMovies.map((movie) => (
    <MovieCard
      clickEvent={onClickedMovie}
      key={movie.movieId}
      movieData={movie}
      wasSelected={checkSelected(movie)}
    />
  ));

  const toRecLink = () =>
    selectedMovies.length > 4 ? (
      <Link to={{ pathname: "/rate", state: { movies: selectedMovies } }}>
        <button>Next</button>
      </Link>
    ) : (
      <button>Select {5 - selectedMovies.length} more</button>
    );

  // const sortByProperty = (property) => {
  //   return function (a, b) {
  //     if (typeof a.api.data.movieData[property] === "number") {
  //       return a.api.data.movieData[property] - b.api.data.movieData[property];
  //     } else {
  //       return a.api.data.movieData[property] < b.api.data.movieData[property]
  //         ? -1
  //         : a.api.data.movieData[property] > b.api.data.movieData[property]
  //         ? 1
  //         : 0;
  //     }
  //   };
  // };

  const onClickSort = (property) => {
    setSortedBy(property);
    let movies = moviesToShow;
    movies.sort(function (a, b) {
      return b.api.data.movieData[property] - a.api.data.movieData[property];
    });
    //setGenreMovies(movies);
    setMoviesToShow(movies);
    reArrange(movies);
  };

  const onClickDecade = (decade) => {
    let years = [0, 0];
    if (decade === "all" || decade === currentDecade) {
      setCurrentDecade("all");
      setMoviesToShow(genreMovies);
      reArrange(genreMovies);
      return;
    }
    if (decade === "00s") {
      years = [2000, 2009];
    }
    if (decade === "90s") {
      years = [1990, 1999];
    }
    if (decade === "80s") {
      years = [1980, 1989];
    }
    if (decade === "70s") {
      years = [1970, 1979];
    }
    if (decade === "60s") {
      years = [1960, 1969];
    }
    if (decade === "50s") {
      years = [1950, 1959];
    }
    if (decade === "40s") {
      years = [1940, 1949];
    }
    if (decade === "30s") {
      years = [1930, 1939];
    }
    let movies = [];
    for (let movie of genreMovies) {
      if (
        parseInt(movie.api.data.movieData.release_date) >= years[0] &&
        movie.api.data.movieData.release_date <= years[1]
      ) {
        movies.push(movie);
      }
    }
    setSortedBy("decade");
    setCurrentDecade(decade);
    reArrange(movies);
    setDecadeMovies(movies);
    setMoviesToShow(movies);
  };

  const reArrange = (movies) => {
    const current = movies.slice(0, 9);
    setCurrentMovies(current);
    setCurrentLast(9);
  };

  return tmdbLoaded ? (
    <div className="grid-container full">
      <h5 className="noMargin">Pick 5 movies you know</h5>
      <h6 className="noPadding noMargin">Choose from decade</h6>
      <ul className="timeline">
        {/* <li
          onClick={() => onClickDecade("30s")}
          className={currentDecade === "30s" ? "active" : ""}
        ></li> */}
        <li
          onClick={() => onClickDecade("40s")}
          className={currentDecade === "40s" ? "active" : ""}
        ></li>
        <li
          onClick={() => onClickDecade("50s")}
          className={currentDecade === "50s" ? "active" : ""}
        ></li>
        <li
          onClick={() => onClickDecade("60s")}
          className={currentDecade === "60s" ? "active" : ""}
        ></li>
        <li
          onClick={() => onClickDecade("70s")}
          className={currentDecade === "70s" ? "active" : ""}
        ></li>
        <li
          onClick={() => onClickDecade("80s")}
          className={currentDecade === "80s" ? "active" : ""}
        ></li>
        <li
          onClick={() => onClickDecade("90s")}
          className={currentDecade === "90s" ? "active" : ""}
        ></li>
        <li
          onClick={() => onClickDecade("00s")}
          className={currentDecade === "00s" ? "active" : ""}
        ></li>
      </ul>
      <div className="grid-container full">
        <div className="grid-container thirds">
          <h6 className="noMargin sorth">Sort by:</h6>
          <button
            className={sortedBy === "popularity" ? "sortBtn active" : "sortBtn"}
            onClick={() => onClickSort("popularity")}
          >
            Popular
          </button>
          <button
            className={
              sortedBy === "vote_average" ? "sortBtn active" : "sortBtn"
            }
            onClick={() => onClickSort("vote_average")}
          >
            Top rated
          </button>
        </div>
      </div>

      <ul className="grid-container cardGrid">
        {wasLoaded ? (
          movieCards
        ) : (
          <div className="spinnerContainer space-top">
            <Spinner name="ball-grid-beat" color="#469580" fadeIn="quarter" />
          </div>
        )}
      </ul>
      <div className="bottom-container">
        <div className="grid-container full noPadding noGap">
          <div className="grid-container halves">
            <button onClick={() => onClickedMore()}>Show more</button>
            {toRecLink()}
          </div>

          <div>
            <p className="noMargin">Your selections:</p>
            <ul className="grid-container fifths noPadding">
              {getSelectedTitles()}
            </ul>
          </div>
        </div>
      </div>
      <div className="space-bottom"></div>
    </div>
  ) : (
    <div className="spinnerContainer space-top">
      <Spinner name="ball-grid-beat" color="#469580" fadeIn="quarter" />
    </div>
  );
};

export default Movies;
