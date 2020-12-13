import { useEffect, useState, useContext } from "react";
import * as axios from "axios";
import countryList from "react-select-country-list";
import { Link } from "react-router-dom";
import { authContext } from "../../contexts/AuthContext";

const Questionnaire = (props) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { auth } = useContext(authContext);
  const [wobble, setWobble] = useState(0);

  useEffect(() => {
    fetchQuestionnaire();
  }, []);

  const fetchQuestionnaire = async () => {
    if (typeof props.questionnaireId !== "undefined") {
      const questionnaire = await axios.get(
        `http://localhost:5000/questionnaires/${props.questionnaireId}`
      );
      setQuestionnaire(questionnaire.data);
    }
  };

  const addAnswer = (questionKey, answer) => {
    let prevAnswers = answers;
    prevAnswers[questionKey] = answer;
    setAnswers(prevAnswers);
  };

  const onAnswerGiven = (key, answer) => {
    if (
      questionnaire.questions[currentQuestion].input === "number" ||
      questionnaire.questions[currentQuestion].input === "age"
    ) {
      if (answer > Math.floor(answer)) {
        setErrorMessage("Input must be a whole number");
        return;
      }
    }

    if (currentQuestion < Object.keys(questionnaire.questions).length) {
      if (
        questionnaire.questions[currentQuestion + 1].input === "nationality"
      ) {
        setCurrentAnswer("Norway");
      }
      if (questionnaire.questions[currentQuestion + 1].input === "number") {
        setCurrentAnswer("0");
      }
    }
    setWobble(1);
    setCurrentQuestion(key + 1);
    addAnswer(key, answer);
    setErrorMessage(null);
  };

  const onBackClick = () => {
    if (typeof answers[currentQuestion - 1] !== "undefined") {
      setCurrentAnswer(answers[currentQuestion - 1]);
      setCurrentQuestion(currentQuestion - 1);
      setErrorMessage(null);
    }
  };

  const submitAnswers = () => {
    const answer = {
      questionnaireId: props.questionnaireId,
      answers: answers,
    };
    postAnswer(answer);
  };

  const postAnswer = async (answer) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/answers/add",
        answer,
        { headers: { "auth-token": auth.data } }
      );
    } catch (err) {
      console.log(err.response.data);
      setErrorMessage(err.response.data);
    }
  };

  const onPressEnter = (event) => {
    if (event.keyCode == 13) {
      let prevAnswers = answers;
      prevAnswers[currentQuestion] = event.target.value;
      setAnswers(prevAnswers);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const createAlternatives = (questionKey, input) => {
    if (input === "likert-5") {
      return likert5(questionKey);
    }
    if (input === "likert-7") {
      return likert7(questionKey);
    }
    if (input === "gender") {
      return gender(questionKey);
    }
    if (input === "number") {
      return num(questionKey);
    }
    if (input === "age") {
      return age(questionKey);
    }
    if (input === "nationality") {
      return nationality(questionKey);
    }
  };

  const gender = (questionKey) => {
    const alternatives = ["Female", "Male", "Other", "Rather not say"];
    return (
      <div className="grid-container quarters">
        {alternatives.map((alternative) => {
          return (
            <button
              className="genderBtn"
              onClick={() => onAnswerGiven(questionKey, alternative)}
            >
              {alternative}
            </button>
          );
        })}
      </div>
    );
  };

  const age = (questionKey) => {
    return (
      <div className="grid-container full">
        <input
          value={currentAnswer}
          type="number"
          name="age"
          id="age"
          min="18"
          max="120"
          step="1"
          onChange={handleInputChange}
          onKeyDown={onPressEnter}
        />

        {currentQuestion > 1 ? (
          <div className="grid-container halves">
            <button onClick={onBackClick}>Back</button>
            <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
              Next
            </button>
          </div>
        ) : (
          <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
            Next
          </button>
        )}
      </div>
    );
  };

  const num = (questionKey) => {
    return (
      <div className="grid-container full">
        <input
          value={currentAnswer}
          type="number"
          name={questionKey}
          id={questionKey}
          step="1"
          onChange={handleInputChange}
          onKeyDown={onPressEnter}
        />
        {currentQuestion > 1 ? (
          <div className="grid-container halves">
            <button onClick={onBackClick}>Back</button>
            <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
              Next
            </button>
          </div>
        ) : (
          <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
            Next
          </button>
        )}
      </div>
    );
  };

  const nationality = (questionKey) => {
    const countries = countryList().getData();
    //setCurrentAnswer("Norway");
    return (
      <div className="grid-container full">
        <select onChange={handleInputChange} defaultValue={currentAnswer}>
          {countries.map((country) => (
            <option key={country.value} value={country.label}>
              {country.label}
            </option>
          ))}
        </select>
        {currentQuestion > 1 ? (
          <div className="grid-container halves">
            <button onClick={onBackClick}>Back</button>
            <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
              Next
            </button>
          </div>
        ) : (
          <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
            Next
          </button>
        )}
      </div>
    );
  };

  const likert7 = (questionKey) => {
    const alternatives = [1, 2, 3, 4, 5, 6, 7];
    return (
      <div>
        <div className="grid-container sevenths">
          {alternatives.map((alternative) => {
            return (
              <button
                className="likert7"
                onClick={() => onAnswerGiven(questionKey, alternative)}
              >
                {alternative}
              </button>
            );
          })}
        </div>
        <div className="grid-container fifths">
          <div>
            <p className="likert7Txt">Disagree strongly</p>
          </div>
          <div></div>
          <div>
            <p className="likert7Txt">Neither agree nor disagree</p>
          </div>
          <div></div>
          <div>
            <p className="likert7Txt">Agree strongly</p>
          </div>
        </div>
      </div>
    );
  };

  const likert5 = (questionKey) => {
    const alternatives = [
      "Much more A than the others",
      "Slightly more A than the others",
      "Slightly more B than the others",
      "About the same",
      "Much more B than the others",
      "Slightly more C than the others",
      "Much more C than the others",
    ];

    return (
      <div className="grid-container sevenths noPadding nonoGap">
        {alternatives.map((alternative) => {
          return (
            <button
              className="likert5"
              onClick={() => onAnswerGiven(questionKey, alternative)}
            >
              {alternative}
            </button>
          );
        })}
      </div>
    );
  };

  const checkIfButtons = (inputType) => {
    if (
      inputType === "likert-5" ||
      inputType === "likert-7" ||
      inputType === "gender"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;

    setCurrentAnswer(value);
  };

  return (
    <div>
      {questionnaire !== null ? (
        <div
          className="grid-container full questionnaire"
          onAnimationEnd={() => setWobble(0)}
          wobble={wobble}
        >
          {currentQuestion < Object.keys(questionnaire.questions).length + 1 ? (
            <div className="grid-container full questionnaire2">
              {checkIfButtons(
                questionnaire.questions[currentQuestion].input
              ) ? (
                <p className="label">
                  {questionnaire.questions[currentQuestion].text}
                </p>
              ) : (
                <label
                  className="label"
                  htmlFor="answer"
                  value={questionnaire.questions[currentQuestion].text}
                >
                  {questionnaire.questions[currentQuestion].text}
                </label>
              )}
              {createAlternatives(
                questionnaire.questions[currentQuestion].key,
                questionnaire.questions[currentQuestion].input
              )}
              {checkIfButtons(
                questionnaire.questions[currentQuestion].input
              ) ? (
                currentQuestion > 1 ? (
                  <div className="grid-container full">
                    <button onClick={onBackClick}>Back</button>
                  </div>
                ) : null
              ) : null}
              <p>{errorMessage}</p>
            </div>
          ) : (
            <div className="grid-container halves">
              <button onClick={onBackClick}>Back</button>
              <Link to={props.nextStep}>
                <button onClick={submitAnswers}>Next</button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Questionnaire;
