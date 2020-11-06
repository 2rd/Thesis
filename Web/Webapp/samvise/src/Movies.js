import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { default: MovieCard } = require("./MovieCard");
const all_movies = require("./data/movies.json");

const Movies = ({ match }) => {
  const [allMovies, setAllMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [wasMounted, setWasMounted] = useState(false);
  const [currentlast, setCurrentLast] = useState(0);
  const [selectedMovies, setSelectedMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const fetchMovies = all_movies;

    const movies = fetchGenreMovies(
      fetchMovies,
      match.params.genres.split(",")
    );
    setGenreMovies(movies);
    setCurrentMovies(movies.slice(0, 9));
    setCurrentLast(10);
    setWasMounted(true);
  };

  const fetchGenreMovies = (movies, genres) => {
    let genreMovies = [];
    for (let movie of Object.entries(movies)) {
      for (let genre of genres) {
        if (movie[1]["genres"].includes(genre)) {
          genreMovies.push(movie);
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
  const onClickedMovie = (movieData, tmdbData) => {
    if (!selectedMovies.includes(movieData)) {
      movieData.title = tmdbData.title;
      movieData.tmdbId = tmdbData.id;
      movieData.year = tmdbData.release_date;
      movieData.description = tmdbData.overview;
      movieData.posterPath = tmdbData.poster_path;
      //console.log(tmdbData);
      const selectedUpdated = getUpdatedSelectedMovies(
        selectedMovies,
        movieData
      );
      setSelectedMovies(selectedUpdated);
    }
  };
  const getUpdatedSelectedMovies = (selectedMovies = [], movie) => {
    const movies = [...selectedMovies];
    movies.push(movie);
    return movies;
  };
  const getSelectedTitles = () => {
    const selected = selectedMovies.map((movie) => (
      <li key={movie.title}>{movie.title}</li>
    ));
    return selected;
  };
  const movieCards = currentMovies.map((movie) => (
    <MovieCard
      clickEvent={onClickedMovie}
      key={movie[1]["movieId"]}
      movieData={movie[1]}
    />
  ));
  const toRecLink = () =>
    selectedMovies.length > 4 ? (
      <Link to={{ pathname: "/movie/0", state: { movies: selectedMovies } }}>
        Rate movies
      </Link>
    ) : (
      <a>Select {5 - selectedMovies.length} more to rate</a>
    );

  return (
    <div>
      <h2>Movie preferences</h2>
      <p>You have selected:</p>
      <ul>{getSelectedTitles()}</ul>
      <ul className="grid-container">
        {wasMounted ? movieCards : "Loading..."}
      </ul>
      <div className="container">
        <button onClick={() => onClickedMore()}>More movies</button>
        {toRecLink()}
      </div>
    </div>
  );
};

export default Movies;
