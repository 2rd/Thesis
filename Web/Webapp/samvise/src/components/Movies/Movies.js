import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TmdbApi from "../../helper/TmdbApi";

const { default: MovieCard } = require("../MovieCard/MovieCard");

const Movies = ({ match }) => {
  const [genreMovies, setGenreMovies] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [wasLoaded, setWasLoaded] = useState(false);
  const [currentlast, setCurrentLast] = useState(0);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [tmdbLoaded, setTmdbLoaded] = useState(false);
  const [sortedBy, setSortedBy] = useState("Sort by:");

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
    setCurrentMovies(genreMovies.slice(currentlast, currentlast + 9));
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
      <li key={movie.title}>{movie.title}</li>
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
        Rate movies
      </Link>
    ) : (
      <a>Select {5 - selectedMovies.length} more to rate</a>
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
    let movies = genreMovies;
    movies.sort(function (a, b) {
      return b.api.data.movieData[property] - a.api.data.movieData[property];
    });
    setGenreMovies(movies);
    reArrange(movies);
  };

  const reArrange = (movies) => {
    const current = movies.slice(0, 9);
    setCurrentMovies(current);
    setCurrentLast(9);
  };

  return tmdbLoaded ? (
    <div className="grid-container full">
      <h2>Movie preferences</h2>
      <div className="grid-container halves">
        <div className="grid-container halves">
          <button
            className="dropdownBtn"
            onClick={() => onClickSort("popularity")}
          >
            Popularity
          </button>
          <button
            className="dropdownBtn"
            onClick={() => onClickSort("vote_average")}
          >
            Rating
          </button>
        </div>
      </div>

      <ul className="grid-container cardGrid">
        {wasLoaded ? movieCards : "Loading..."}
      </ul>
      <div className="container">
        <button onClick={() => onClickedMore()}>More movies</button>
        {toRecLink()}
      </div>
      <div>
        <p>Your selections:</p>
        <ul className="grid-container fifths">{getSelectedTitles()}</ul>
      </div>
    </div>
  ) : (
    <div className="grid-container full">Loading..</div>
  );
};

export default Movies;
