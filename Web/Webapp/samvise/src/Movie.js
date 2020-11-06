import { useEffect, useState } from "react";
import Api from "./helper/Api";
import { Link } from "react-router-dom";

const Movie = ({ location, match }) => {
  const [currentMovie, setCurrentMovie] = useState(
    parseInt(match.params.number)
  );
  const [movieData, setMovieData] = useState([]);
  const [trailerFrame, setTrailerFrame] = useState(null);

  useEffect(() => {
    setCurrentMovie(parseInt(match.params.number));
    setMovieData(location.state.movies[currentMovie]);
    fetchTrailer();
  }, []);

  const fetchTrailer = async () => {
    const api = new Api();
    const tmdbId = location.state.movies[currentMovie].tmdbId;
    const trailer = await api.getMovieTrailer(tmdbId);
    setTrailerFrame(createTrailerFrame(trailer));
  };

  const createTrailerFrame = (trailer) => {
    const trailerKey = trailer.data.results[0].key;
    return (
      <iframe src={`https://www.youtube.com/embed/${trailerKey}`}></iframe>
    );
  };

  return (
    <div>
      {trailerFrame}
      <button onClick={() => setCurrentMovie(currentMovie + 1)}>Next</button>
    </div>
  );
};

export default Movie;
