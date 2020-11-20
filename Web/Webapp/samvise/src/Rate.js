import { useEffect, useState } from "react";
import Api from "./helper/Api";
import { Link } from "react-router-dom";

const Movie = ({ location, match }) => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [movieData, setMovieData] = useState([]);
  const [trailerFrame, setTrailerFrame] = useState(null);

  useEffect(() => {
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

  const onNextClick = () => {
    setCurrentMovie(currentMovie + 1);
    fetchTrailer();
  };

  const nextButton = () => {
    if (currentMovie < location.state.movies.length) {
      return <button onClick={() => onNextClick()}>Next</button>;
    } else {
      return <Link to="/recommendations">Continue</Link>;
    }
  };

  return (
    <div>
      <div className="container">{trailerFrame}</div>
      <div>{nextButton()}</div>
    </div>
  );
};

export default Movie;
