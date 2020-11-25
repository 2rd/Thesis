import { useEffect, useState } from "react";
import SmallMovieCard from "./SmallMovieCard";
import * as axios from "axios";

const Recommendations = ({ location }) => {
  const [displayMovie, setdisplayMovie] = useState({
    show: false,
    movie: null,
  });
  const [recs, setRecs] = useState(null);
  const [questionnaire, setQuestionnaire] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    fetchQuestionnaire();
  }, []);

  const fetchRecommendations = async () => {
    const recommendations = await fetch(
      `https://samvise-api.herokuapp.com/get-recommendations/?interactions=${JSON.stringify(
        location.state.ratings
      )}`
    );
    setRecs(await recommendations.json());
  };

  const movieDetailsCallback = (movie) => {
    setdisplayMovie({ show: true, movie: movie });
  };

  const onBackClick = () => {
    setdisplayMovie({ show: false, movie: null });
  };

  const recommendations = () => {
    if (recs === null) {
      return <div>LOADING</div>;
    } else {
      return displayMovie.show ? (
        <div>
          <div>
            <h4>
              This page will contain information about the selected movie:{" "}
              {displayMovie.movie.data.movieData.original_title}
            </h4>
          </div>
          <button onClick={onBackClick}>Back</button>
        </div>
      ) : (
        <div className="grid-container full">
          <div className="recommendations">
            <h6>LIST A (visual features)</h6>
            <ul className="grid-container fifths">
              {[...Object.values(recs.results.visual.top_items)]
                .slice(0, 5)
                .map((recommendation) => {
                  return (
                    <li key={recommendation.movieId}>
                      <SmallMovieCard
                        movieId={recommendation.movieId}
                        displayMovie={movieDetailsCallback}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="recommendations">
            <h6>LIST B (subtitles)</h6>
            <ul className="grid-container fifths">
              {[...Object.values(recs.results.subtitles.top_items)]
                .slice(0, 5)
                .map((recommendation) => {
                  return (
                    <li key={recommendation.movieId}>
                      <SmallMovieCard
                        movieId={recommendation.movieId}
                        displayMovie={movieDetailsCallback}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
          <p>Click the thumbnails to see movie info and trailer</p>
        </div>
      );
    }
  };

  const fetchQuestionnaire = async () => {
    const questionnaire = await axios.get(
      "http://localhost:5000/questionnaires/1TwH5KhBs"
    );
    setQuestionnaire(questionnaire.data);
  };

  return (
    <div>
      <div>{recommendations()}</div>

      {displayMovie.show ? (
        <div></div>
      ) : questionnaire !== null && recs !== null ? (
        <div>
          <p>
            List A and B contain the top movie recommendations for you from
            different "recommenders". Please answer the following questions to
            help us understand your preferences about these recommenders.
          </p>
          <ol>
            {[...Object.values(questionnaire.questions)]
              .slice(0, 5)
              .map((question) => {
                return <li key={question.key}>{question.text}</li>;
              })}
          </ol>
        </div>
      ) : (
        <div>Loading questions</div>
      )}
    </div>
  );
};

export default Recommendations;
