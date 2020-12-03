import { useEffect, useState } from "react";
import TmdbApi from "../../helper/TmdbApi";

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
    props.displayMovie(api);
  };

  return wasFetched ? (
    <button className="cardContainer small" onClick={onClickedDetails}>
      <div>
        <img
          src={`http://image.tmdb.org/t/p/w92${api.data.movieData.poster_path}`}
          alt={api.data.movieData.title}
        ></img>
      </div>

      {/* <div>
        <h6>
          {api.data.movieData.title + ` (${api.data.movieData.release_date})`}
        </h6>
      </div> */}
    </button>
  ) : (
    <div>LOADING</div>
  );
};

export default SmallMovieCard;
