import { useEffect, useState } from "react";
import SmallMovieCard from "../SmallMovieCard/SmallMovieCard";
import * as axios from "axios";
import Questionnaire from "../Questionnaire/Questionnaire";
const Spinner = require("react-spinkit");

const Recommendations = ({ location }) => {
  const [displayMovie, setdisplayMovie] = useState({
    show: false,
    movie: null,
    trailer: "undefined",
  });
  const [recs, setRecs] = useState(null);
  const [trailerFrame, setTrailerFrame] = useState(null);
  const [questionnaireStarted, setQuestionnaireStarted] = useState(false);
  // const [questionnaire, setQuestionnaire] = useState(null);
  // const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetchRecommendations();
    // fetchQuestionnaire();
  }, []);

  const fetchRecommendations = async () => {
    const recommendations = await axios.get(
      `https://samvise-api.herokuapp.com/get-recommendations/?interactions=${JSON.stringify(
        location.state.ratings
      )}`
    );

    setRecs(await recommendations.data);
  };

  const movieDetailsCallback = (movie) => {
    display(movie);
    // setdisplayMovie({ show: true, movie: movie });
  };

  const display = async (movie) => {
    const trailer = await movie.getMovieTrailer();
    setdisplayMovie({
      show: true,
      movie: movie,
      trailer:
        trailer.data.results.length > 0
          ? trailer.data.results[0].key
          : "undefined",
    });
  };

  const onBackClick = () => {
    console.log();
    setdisplayMovie({ show: false, movie: null });
  };

  const recommendations = () => {
    if (recs === null) {
      return (
        <div className="space-top grid-container full">
          <h6>
            Generating <br />
            recommendations...
          </h6>
          <div className="spinnerContainer">
            <Spinner name="ball-grid-beat" color="#469580" fadeIn="quarter" />
          </div>
        </div>
      );
    } else {
      return displayMovie.show ? (
        <div className="grid-container full">
          <div>
            <div className="iframeContainer">
              <iframe
                src={`https://www.youtube.com/embed/${displayMovie.trailer}`}
              ></iframe>
            </div>

            <h4>
              {`${displayMovie.movie.data.movieData.title} (${displayMovie.movie.data.movieData.release_date})`}
            </h4>
            <p>{displayMovie.movie.data.movieData.overview}</p>
          </div>
          <button onClick={onBackClick}>Back</button>
        </div>
      ) : (
        <div className="grid-container full">
          <div className="recommendations">
            <h6 className="listHeader">LIST A (visual features)</h6>
            <ul className="grid-container fifths">
              {[...Object.values(recs.results.visual.top_items)]
                .slice(0, 5)
                .map((recommendation) => {
                  return (
                    <li key={recommendation.movieId} className="smallCardLi">
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
            <h6 className="listHeader">LIST B (subtitles)</h6>
            <ul className="grid-container fifths">
              {[...Object.values(recs.results.subtitles.top_items)]
                .slice(0, 5)
                .map((recommendation) => {
                  return (
                    <li key={recommendation.movieId} className="smallCardLi">
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
            <h6 className="listHeader">LIST C (tags)</h6>
            <ul className="grid-container fifths">
              {[...Object.values(recs.results.tags.top_items)]
                .slice(0, 5)
                .map((recommendation) => {
                  return (
                    <li key={recommendation.movieId} className="smallCardLi">
                      <SmallMovieCard
                        movieId={recommendation.movieId}
                        displayMovie={movieDetailsCallback}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>

          <p className="noMargin">
            Click the thumbnails to see movie info and trailer
          </p>
        </div>
      );
    }
  };

  // const newAnswer = (questionKey, answer) => {
  //   const answerObj = {
  //     userId: "",
  //     questionnaireId: "1TwH5KhBs",
  //     questionKey: questionKey,
  //     answer: answer,
  //   };
  // };

  // const fetchQuestionnaire = async () => {
  //   const questionnaire = await axios.get(
  //     "http://localhost:5000/questionnaires/1TwH5KhBs"
  //   );
  //   setQuestionnaire(questionnaire.data);
  // };

  return (
    <div className="recommendations-container">
      <div>{recommendations()}</div>

      {displayMovie.show ? (
        <div></div>
      ) : recs !== null ? (
        <div className="bottom-container">
          {!questionnaireStarted ? (
            <div>
              <div className="grid-container full nextBtnContainer ">
                <div>
                  <p className="bottomDescription">
                    List A and B contain the top movie recommendations for you
                    from different "recommenders". Please answer the following
                    questions to help us understand your preferences about these
                    recommenders.
                  </p>
                </div>
              </div>
              <button onClick={() => setQuestionnaireStarted(true)}>
                Next
              </button>
            </div>
          ) : (
            <Questionnaire questionnaireId="1TwH5KhBs" nextStep="/thankyou" />
          )}
        </div>
      ) : null}
      <div className="space-bottom"></div>
    </div>
  );
};

export default Recommendations;
