import { useEffect, useState } from "react";
import TmdbApi from "../../helper/TmdbApi";
const Spinner = require("react-spinkit");

const SmallMovieCard = (props) => {
  const [api, setApi] = useState(null);
  const [wasFetched, setWasFetched] = useState(false);

  useEffect(() => {
    if (wasFetched) {
    } else {
      updateApi();
    }
  }, [wasFetched]);

  const updateApi = () => {
    if (!wasFetched) {
      const api = new TmdbApi(parseInt(props.movieId), wasFetchedCallback);
      setApi(api);
    }
  };

  const wasFetchedCallback = (fetched) => {
    setWasFetched(fetched);
  };

  const onClickedDetails = () => {
    if (api.data.movieData.length !== 0) {
      props.displayMovie(api);
    }
  };

  return wasFetched ? (
    <button className="cardContainer small" onClick={onClickedDetails}>
      <div>
        {api.data.movieData.length !== 0 ? (
          <img
            // src={`http://image.tmdb.org/t/p/w92${api.data.movieData.poster_path}`}
            src={`https://image.tmdb.org/t/p/w154${api.data.movieData.poster_path}`}
            alt={api.data.movieData.title}
          ></img>
        ) : (
          <p>{props.movieTitle}</p>
        )}
      </div>

      {/* <div>
        <h6>
          {api.data.movieData.title + ` (${api.data.movieData.release_date})`}
        </h6>
      </div> */}
    </button>
  ) : (
    <div className="grid-container full loading-container">
      <div>
        <Spinner name="double-bounce" color="#469580" fadeIn="quarter" />
      </div>

      <p className="tinytext">
        Loading <br /> recommendation...
      </p>
    </div>
  );
};

export default SmallMovieCard;
