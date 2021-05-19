import { useContext, useEffect, useState } from "react";
import SmallMovieCard from "../components/SmallMovieCard/SmallMovieCard";
import * as axios from "axios";
import Questionnaire from "../components/Questionnaire/Questionnaire";
import Progressbar from "../components/Progressbar/Progressbar";
import { authContext } from "../contexts/AuthContext";
const Spinner = require("react-spinkit");

const Recommendations = ({ location }) => {
  const [displayMovie, setdisplayMovie] = useState({
    show: false,
    movie: null,
    trailer: "undefined",
  });
  const [recs, setRecs] = useState(null);
  const [questionnaireStarted, setQuestionnaireStarted] = useState(false);
  const [chosenRecLists, setChosenRecLists] = useState(null);
  const [progress, setProgress] = useState(43.33);
  const [posted, setPosted] = useState(false);
  const [mediaConsumptionAnswered, setMediaConsumptionAnswered] = useState(
    false
  );
  const { auth } = useContext(authContext);

  // const [questionnaire, setQuestionnaire] = useState(null);
  // const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (typeof location.state.ratings !== "undefined") {
      fetchRecommendations();
      setChosenRecLists(pickRandomRecLists());
    }
  }, []);

  useEffect(() => {
    if (recs !== null && !posted) {
      postRecs(recs);
    }
  }, [recs]);

  const postRecs = async (recommendations) => {
    try {
      const res = await axios.post(
        "recommendations/add",
        { recommendations: recommendations.results },
        { headers: { "auth-token": auth.data } }
      );
      setPosted(true);
    } catch (err) {
      console.log(err.response.data);
    }
  };

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
  };

  const progressForwardCallback = () => {
    setProgress(progress + 1.67);
  };

  const progressBackCallback = () => {
    setProgress(progress - 1.67);
  };

  const nextStepCallback = (tf) => {
    setMediaConsumptionAnswered(tf);
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

  const pickRandomRecLists = () => {
    let lists = ["visual", "tags", "subtitles"];
    lists.splice(Math.floor(Math.random() * lists.length), 1);
    const chosen = {
      A: lists.splice(Math.floor(Math.random() * lists.length), 1)[0],
      B: lists[0],
    };
    return chosen;
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
      return (
        <div style={{ display: "flex" }}>
          <div
            className={
              displayMovie.show
                ? "grid-container full hidden"
                : "grid-container full"
            }
          >
            <p className="noMargin">
              You can click on a movie to see additional movie info and trailer.
            </p>
            <div className="recommendations">
              <h6 className="listHeader">LIST A</h6>
              <ul className="grid-container fifths">
                {[...Object.values(recs.results[chosenRecLists.A].top_items)]
                  .slice(0, 5)
                  .map((recommendation) => {
                    return (
                      <li key={recommendation.movieId} className="smallCardLi">
                        <SmallMovieCard
                          movieId={recommendation.movieId}
                          movieTitle={recommendation.title}
                          displayMovie={movieDetailsCallback}
                        />
                      </li>
                    );
                  })}
              </ul>
            </div>

            <div className="recommendations">
              <h6 className="listHeader">LIST B</h6>
              <ul className="grid-container fifths">
                {[...Object.values(recs.results[chosenRecLists.B].top_items)]
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
          </div>
          {displayMovie.show ? (
            <div className="grid-container full" style={{ maxWidth: "500px" }}>
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
              <button onClick={onBackClick} className="back-button">
                Back
              </button>
            </div>
          ) : null}
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
  //     "/questionnaires/1TwH5KhBs"
  //   );
  //   setQuestionnaire(questionnaire.data);
  // };

  return (
    <div className="recommendations-container">
      <Progressbar progress={progress} />
      {!mediaConsumptionAnswered ? (
        <div style={{ marginTop: "8em" }}>
          <Questionnaire
            questionnaireId="hH6jKCS4e"
            progressForwardCallback={progressForwardCallback}
            progressBackCallback={progressBackCallback}
            nextStepCallback={nextStepCallback}
            nextOnSamePage={true}
          />
        </div>
      ) : recs !== null ? (
        <div className="grid-container full" style={{ marginTop: "3%" }}>
          <h4>Recommendations</h4>
          <div className={displayMovie.show ? "hidden" : ""}>
            {!questionnaireStarted ? (
              <div
                style={{
                  backgroundColor: "var(--color4)",
                  paddingBottom: "2%",
                }}
              >
                <div className="grid-container full nextBtnContainer ">
                  <div>
                    <p className="bottomDescription">
                      We have generated two lists of recommendations. Please
                      answer the following questions by comparing them with each
                      other.
                    </p>
                  </div>
                </div>
                <button onClick={() => setQuestionnaireStarted(true)}>
                  Next
                </button>
              </div>
            ) : (
              <Questionnaire
                questionnaireId="1TwH5KhBs"
                nextStep="/sus"
                chosenRecLists={chosenRecLists}
                progressForwardCallback={progressForwardCallback}
                progressBackCallback={progressBackCallback}
              />
            )}
          </div>
          <div>{recommendations()}</div>
        </div>
      ) : (
        <div className="space-top grid-container full">
          <h6>
            Generating <br />
            recommendations...
          </h6>
          <div className="spinnerContainer">
            <Spinner name="ball-grid-beat" color="#469580" fadeIn="quarter" />
          </div>
        </div>
      )}

      <div className="space-bottom50"></div>
    </div>
  );
};

export default Recommendations;
