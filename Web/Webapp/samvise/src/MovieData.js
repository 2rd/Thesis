import { useEffect, useState } from "react";
import axios from "axios";

const api_key = "f1cf71c4de5c110d27c1a458acf3b2e3";

const MovieData = (props) => {
  useEffect(() => {
    fetchMovie();
  }, []);

  const [data, setData] = useState({ movieData: [], isFetching: false });

  const fetchMovie = async () => {
    const allMovies = await axios.get("http://localhost:5000/moviedata");
    let toFetch = null;

    for (let movie of Object.entries(allMovies)) {
      if (movie.movieId === props.movieId) {
        toFetch = movie;
        break;
      }
    }

    if (toFetch !== null) {
      try {
        setData({ ...data, isFetching: true });
        const response = await axios.get(
          `https://api.themoviedb.org/3/find/tt0${toFetch[1].imdbId}?api_key=${api_key}&language=en-US&external_source=imdb_id`
        );
        const movie = response.data.movie_results[0];
        movie.release_date = movie.release_date.substr(0, 4);
        movie.movieId = toFetch[1].movieId;
        movie.popularity = toFetch[1].popularity;
        movie.genres = toFetch[1].genres;
        setData({
          ...data,
          movieData: movie,
          isFetching: false,
        });
      } catch (e) {
        console.log(e);
        setData({ ...data, isFetching: false });
      }

      return [data];
    }
  };
};

export default MovieData;
