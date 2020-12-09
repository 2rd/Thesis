import { useEffect, useState } from "react";

const MovieCard = (props) => {
  const api_key = "f1cf71c4de5c110d27c1a458acf3b2e3";

  useEffect(() => {
    fetchMovie();
    if (typeof props.wasSelected !== "undefined") {
      setSelected(props.wasSelected);
    }
  }, []);

  const [movieData, setMovieData] = useState([]);
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wasLoaded, setWasLoaded] = useState(false);

  const fetchMovie = async () => {
    if (typeof props.movieData.imdbId !== "undefined") {
      try {
        setLoading(true);
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
        data.genres = props.movieData.genres;
        setMovieData(data);
        setWasLoaded(true);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
  };

  const onClickedCard = () => {
    props.clickEvent(movieData);
    if (!selected) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  };

  return (
    <button
      onClick={wasLoaded ? () => onClickedCard() : () => null}
      label={wasLoaded ? `${movieData.title}` : ""}
      className={`card ${selected ? "selected" : ""} cardContainer`}
    >
      {wasLoaded ? (
        <div>
          <img
            src={`http://image.tmdb.org/t/p/w154${movieData.poster_path}`}
            alt={movieData.title}
            className="moviePoster"
          ></img>
          <div>
            {/* <p>{movieData.title + ` (${movieData.release_date})`}</p> */}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </button>
  );
};

export default MovieCard;
