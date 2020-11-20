import { useEffect, useState } from "react";
import TmdbApi from "./helper/TmdbApi";

const SmallMovieCard = (props) => {
  const [api, setApi] = useState(null);
  const [wasFetched, setWasFetched] = useState(false);
  const [showPlot, setShowPlot] = useState(false);

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

  const showHidePlot = () => {
    showPlot ? setShowPlot(false) : setShowPlot(true);
  };

  const onClickedDetails = () => {
    props.showMovieDetails(api);
  };

  return wasFetched ? (
    <div className="grid-container full">
      <div>
        <img
          src={`http://image.tmdb.org/t/p/w154${api.data.movieData.poster_path}`}
          alt={api.data.movieData.title}
        ></img>
      </div>

      <div>
        <h6>
          {api.data.movieData.title + ` (${api.data.movieData.release_date})`}
        </h6>
        {/* <button onClick={showHidePlot}> */}
        <button onClick={onClickedDetails}>
          {showPlot ? "hide plot" : "show plot"}
        </button>
        {showPlot ? <p>{api.data.movieData.overview}</p> : <p></p>}
      </div>
    </div>
  ) : (
    <div>LOADING</div>
  );
};

export default SmallMovieCard;
