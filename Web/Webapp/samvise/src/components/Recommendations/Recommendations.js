import { useEffect, useState } from "react";
import SmallMovieCard from "../SmallMovieCard/SmallMovieCard";
import * as axios from "axios";
import Questionnaire from "../Questionnaire/Questionnaire";

const Recommendations = ({ location }) => {
  const [displayMovie, setdisplayMovie] = useState({
    show: false,
    movie: null,
    trailer: "undefined",
  });
  const [recs, setRecs] = useState(null);
  const [trailerFrame, setTrailerFrame] = useState(null);
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
      return <div>LOADING</div>;
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
    <div>
      <div>{recommendations()}</div>

      {displayMovie.show ? (
        <div></div>
      ) : recs !== null ? (
        <div>
          <p>
            List A and B contain the top movie recommendations for you from
            different "recommenders". Please answer the following questions to
            help us understand your preferences about these recommenders.
          </p>
          <Questionnaire questionnaireId="1TwH5KhBs" />
          {/* <ol>
            {[...Object.values(questionnaire.questions)]
              .slice(0, 5)
              .map((question) => {
                return <li key={question.key}>{question.text}</li>;
              })}
          </ol> */}
        </div>
      ) : (
        <div>Loading questions</div>
      )}
    </div>
  );
};

export default Recommendations;
