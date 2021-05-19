import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Progressbar from "../components/Progressbar/Progressbar";
import { authContext } from "../contexts/AuthContext";
// import TmdbApi from "../helper/TmdbApi";

const { default: MovieCard } = require("../components/MovieCard/MovieCard");

const Movies = ({ match }) => {
  const [genreMovies, setGenreMovies] = useState([]);
  const [moviesToShow, setMoviesToShow] = useState([]);
  const [decadeMovies, setDecadeMovies] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [wasLoaded, setWasLoaded] = useState(false);
  const [currentlast, setCurrentLast] = useState(0);
  const [selectedMovies, setSelectedMovies] = useState([]);
  // const [tmdbLoaded, setTmdbLoaded] = useState(false);
  const [sortedBy, setSortedBy] = useState("Sort by:");
  const [currentDecade, setCurrentDecade] = useState("all");
  const { auth } = useContext(authContext);
  const Spinner = require("react-spinkit");

  useEffect(() => {
    fetchMovies();
  }, []);

  // useEffect(() => {
  //   if (wasLoaded && !tmdbLoaded) {
  //     fetchTmdbData();
  //   }
  // }, [wasLoaded]);

  useEffect(() => {}, [sortedBy]);

  // const fetchTmdbData = () => {
  //   const movies = [...genreMovies];
  //   const moviesUpdated = [];
  //   for (let movie of movies) {
  //     let fetchMovieData = new TmdbApi(movie.movieId, wasFetchedCallback);
  //     movie.api = fetchMovieData;
  //     moviesUpdated.push(movie);
  //   }
  //   setGenreMovies(moviesUpdated);
  //   setMoviesToShow(moviesUpdated);
  // };

  // const updateGenreMovies = (movie) => {
  //   const movies = [...genreMovies];
  //   movies.push(movie);
  //   return movies;
  // };

  // const wasFetchedCallback = (fetched) => {
  //   setTmdbLoaded(fetched);
  // };

  const fetchMovies = async () => {
    const fetchMovies = await axios.get("/moviedata");
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
    setCurrentMovies(moviesToShow.slice(0, currentlast + 9));
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
      <li key={movie.title} style={{ marginBottom: "0" }}>
        <img
          alt={movie.title}
          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
          style={{ maxHeight: "120px" }}
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

  const submitMovies = () => {
    for (let m of selectedMovies) {
      let movie = { movieId: m.movieId };
      postMovie(movie);
    }
  };

  const postMovie = async (movie) => {
    try {
      const res = await axios.post("/ratings/add", movie, {
        headers: { "auth-token": auth.data },
      });
    } catch (err) {
      console.log(err.response.data);
      // setErrorMessage(err.response.data);
    }
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
        <button onClick={submitMovies}>Next</button>
      </Link>
    ) : (
      <button className="back-button">
        Select {5 - selectedMovies.length} more to continue
      </button>
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
      return b[property] - a[property];
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
        parseInt(movie.release_date) >= years[0] &&
        movie.release_date <= years[1]
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

  return (
    // tmdbLoaded ? (
    <div>
      <Progressbar progress={30} />
      <div className="grid-container full narrow">
        <h4 className="noMargin">Please select 5 movies you know</h4>
        <p className="">
          Please select five movies by clicking on the movie posters below.
        </p>
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
              className={
                sortedBy === "popularity" ? "sortBtn active" : "sortBtn"
              }
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

        {wasLoaded ? (
          <div>
            <ul className="grid-container cardGrid">{movieCards} </ul>
            <button onClick={() => onClickedMore()}>Show more movies</button>
          </div>
        ) : (
          <div className="spinnerContainer space-top">
            <Spinner name="ball-grid-beat" color="#469580" fadeIn="quarter" />
          </div>
        )}
        <div className="space-bottom500"></div>
      </div>
      <div className="bottom-container">
        <div className="grid-container full noPadding noGap">
          <div className="grid-container full">{toRecLink()}</div>

          <div>
            <p className="noMargin">Your selections:</p>
            <ul
              className="grid-container fifths noPadding"
              style={{
                paddingBottom: "1%",
                paddingTop: "1%",
              }}
            >
              {getSelectedTitles()}
            </ul>
          </div>
        </div>
      </div>
    </div>
    // ) : (
    //   <div className="spinnerContainer space-top">
    //     <Spinner name="ball-grid-beat" color="#469580" fadeIn="quarter" />
    //   </div>
    // );
  );
};

export default Movies;
