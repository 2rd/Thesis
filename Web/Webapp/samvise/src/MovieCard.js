import { useEffect, useState } from "react";

const MovieCard = (props) => {
  const api_key = "f1cf71c4de5c110d27c1a458acf3b2e3";

  useEffect(() => {
    fetchMovie();
  }, []);

  const [movieData, setMovieData] = useState([]);

  const fetchMovie = async () => {
    if (typeof props.movieData.imdbId !== "undefined") {
      let imdbId = props.movieData.imdbId;
      if (imdbId.length < 6) {
        imdbId = "0" + props.movieData.imdbId;
      }
      const fetchMovie = await fetch(
        `https://api.themoviedb.org/3/find/tt0${imdbId}?api_key=${api_key}&language=en-US&external_source=imdb_id`
      );
      const movie = await fetchMovie.json();
      const data = movie.movie_results[0];
      data.release_date = data.release_date.substr(0, 4);
      data.movieId = props.movieData.movieId;
      data.popularity = props.movieData.popularity;
      data.genres = props.movieData.genres;
      setMovieData(data);
    }
  };

  return (
    <div className="card" onClick={() => props.clickEvent(movieData)}>
      <img
        src={`http://image.tmdb.org/t/p/w154${movieData.poster_path}`}
        alt={movieData.title}
      ></img>
      <div className="cardContainer">
        <p>{movieData.title + ` (${movieData.release_date})`}</p>
      </div>
    </div>
  );
};

export default MovieCard;
