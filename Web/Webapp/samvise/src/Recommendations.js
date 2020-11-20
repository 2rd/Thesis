import { useEffect, useState } from "react";
import TmdbApi from "./helper/TmdbApi";
import SmallMovieCard from "./SmallMovieCard";

const Recommendations = ({ location }) => {
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const [showMovieDetails, setShowMovieDetails] = useState({
    show: false,
    movie: null,
  });
  const [recs, setRecs] = useState(null);

  const fetchRecommendations = async () => {
    const recommendations = await fetch(
      `https://samvise-api.herokuapp.com/get-recommendations/?interactions=${JSON.stringify(
        location.state.ratings
      )}`
    );
    setRecs(await recommendations.json());
  };

  const movieDetailsCallback = (movie) => {
    setShowMovieDetails({ show: true, movie: movie });
  };

  const recommendations = () => {
    if (recs === null) {
      return <div>LOADING</div>;
    } else {
      return showMovieDetails.show ? (
        <div>
          <button onClick={setShowMovieDetails({ show: false, movie: null })}>
            Back
          </button>
        </div>
      ) : (
        <div className="grid-container full">
          <div>
            <h5>LIST 1 (visual features)</h5>
            <ul className="grid-container fifths">
              {[...Object.values(recs.results.visual.top_items)]
                .slice(0, 5)
                .map((recommendation) => {
                  return (
                    <li>
                      <SmallMovieCard
                        movieId={recommendation.movieId}
                        showMovieDetails={movieDetailsCallback}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
          <div>
            <h5>LIST 2 (subtitles)</h5>
            <ul className="grid-container fifths">
              {[...Object.values(recs.results.subtitles.top_items)]
                .slice(0, 5)
                .map((recommendation) => {
                  return (
                    <li>
                      <SmallMovieCard
                        movieId={recommendation.movieId}
                        showMovieDetails={movieDetailsCallback}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      );
      //   console.log(Object.values(recs.results.subtitles.top_items));
    }
  };
  return <div>{recommendations()}</div>;
};

export default Recommendations;
