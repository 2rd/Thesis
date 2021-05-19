import { useEffect, useState, useContext } from "react";
import * as axios from "axios";
import countryList from "react-select-country-list";
import { Link, Redirect } from "react-router-dom";
import { authContext } from "../../contexts/AuthContext";

const Questionnaire = (props) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { auth } = useContext(authContext);
  const [wobble, setWobble] = useState(0);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetchQuestionnaire();
  }, []);

  const fetchQuestionnaire = async () => {
    if (typeof props.questionnaireId !== "undefined") {
      const questionnaire = await axios.get(
        `/questionnaires/${props.questionnaireId}`
      );
      setQuestionnaire(questionnaire.data);
      if (typeof props.chosenRecLists !== "undefined") {
        addAnswer("lists", props.chosenRecLists);
      }
    }
  };

  const postProgress = async () => {
    try {
      const res = await axios.post(
        "auth/update",
        { completionTime: Date.now(), progress: questionnaire.name },
        { headers: { "auth-token": auth.data } }
      );
    } catch (err) {
      console.log(err.response.data);
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
      const parsed = parseInt(answer);
      if (isNaN(parsed)) {
        setErrorMessage("Input must be a number");
        return;
      }

      if (
        questionnaire.questions[currentQuestion].input === "age" &&
        (parsed < 18 || parsed > 110)
      ) {
        setErrorMessage(
          "Due to privacy rights and regulations, you must be over 18 to participate."
        );
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
    let prevAnswers = answers;
    prevAnswers[key] = answer;
    setWobble(1);
    setCurrentQuestion(key + 1);
    addAnswer(key, answer);
    setErrorMessage(null);
    props.progressForwardCallback();
    if (checkIfLast()) {
      postProgress();
      submitAnswers(prevAnswers);
      setQuestionnaire(null);
      if (nextOnSamePage()) props.nextStepCallback(true);
    }
  };

  const onBackClick = () => {
    if (typeof answers[currentQuestion - 1] !== "undefined") {
      setCurrentAnswer(answers[currentQuestion - 1]);
      setCurrentQuestion(currentQuestion - 1);
      setErrorMessage(null);
      props.progressBackCallback();
    }
  };

  const submitAnswers = (answers) => {
    const answer = {
      questionnaireId: props.questionnaireId,
      answers: answers,
    };
    postAnswer(answer);
  };

  const postAnswer = async (answer) => {
    try {
      const res = await axios.post("/answers/add", answer, {
        headers: { "auth-token": auth.data },
      });
    } catch (err) {
      console.log(err.response.data);
      setErrorMessage(err.response.data);
    }
  };

  const onPressEnter = (event) => {
    if (event.keyCode == 13) {
      onAnswerGiven(currentQuestion, event.target.value);
      if (checkIfLast() && !nextOnSamePage()) {
        setRedirect(true);
      }
    }
  };

  const nextOnSamePage = () => {
    if (typeof props.nextOnSamePage !== "undefined") {
      return props.nextOnSamePage;
    }
    return false;
  };

  const toggleButtons = (questionKey) => {
    return currentQuestion > 1 ? (
      <div className="grid-container halves">
        <button onClick={onBackClick} className="back-button">
          Back
        </button>
        {checkIfLast() ? (
          !nextOnSamePage() ? (
            <Link to={props.nextStep}>
              <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
                Next
              </button>
            </Link>
          ) : (
            <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
              Next
            </button>
          )
        ) : (
          <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
            Next
          </button>
        )}
      </div>
    ) : (
      <div className="grid-container full">
        <button onClick={() => onAnswerGiven(questionKey, currentAnswer)}>
          Next
        </button>
      </div>
    );
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
    if (input === "likert-5-2") {
      return likert5_2(questionKey);
    }
    if (input === "likert-7-2") {
      return likert7_2(questionKey);
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

        {toggleButtons(questionKey)}
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
        {toggleButtons(questionKey)}
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
        {toggleButtons(questionKey)}
      </div>
    );
  };

  const likert7 = (questionKey) => {
    const alternatives = [1, 2, 3, 4, 5, 6, 7];
    return (
      <div>
        <div className="grid-container sevenths nonoGap">
          {alternatives.map((alternative) => {
            return checkIfLast() ? (
              <Link to={props.nextStep}>
                <button
                  className="likert7"
                  onClick={() => onAnswerGiven(questionKey, alternative)}
                >
                  {alternative}
                </button>
              </Link>
            ) : (
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

  const likert7_2 = (questionKey) => {
    // const alternatives = [
    //   "Worst imaginable",
    //   "Awful",
    //   "Poor",
    //   "Fair",
    //   "Good",
    //   "Excellent",
    //   "Best imaginable",
    // ];
    const alternatives = [1, 2, 3, 4, 5, 6, 7];
    return (
      <div>
        <div className="grid-container sevenths nonoGap">
          {alternatives.map((alternative) => {
            return checkIfLast() ? (
              <Link to={props.nextStep}>
                <button
                  className="likert7"
                  onClick={() => onAnswerGiven(questionKey, alternative)}
                >
                  {alternative}
                </button>
              </Link>
            ) : (
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
            <p className="likert7Txt">Worst imaginable</p>
          </div>
          <div>{/* <p className="likert7Txt">Awful</p> */}</div>
          {/* <div>
            <p className="likert7Txt">Poor</p>
          </div> */}
          <div>
            <p className="likert7Txt">Fair</p>
          </div>
          {/* <div>
            <p className="likert7Txt">Good</p>
          </div> */}
          <div>{/* <p className="likert7Txt">Excellent</p> */}</div>
          <div>
            <p className="likert7Txt">Best imaginable</p>
          </div>
        </div>
      </div>
    );
  };

  const likert5 = (questionKey) => {
    const alternatives = [
      "Much more List A",
      "Slightly more List A",
      "About the same",
      "Slightly more List B",
      "Much more List B",
    ];

    return (
      <div className="grid-container fifths noPadding nonoGap">
        {alternatives.map((alternative) => {
          return checkIfLast() ? (
            <Link to={props.nextStep}>
              <button
                className="likert5"
                onClick={() => onAnswerGiven(questionKey, alternative)}
              >
                {alternative}
              </button>
            </Link>
          ) : (
            <button
              className="likert5"
              onClick={() => onAnswerGiven(questionKey, alternative)}
            >
              {alternative}
            </button>
          );
        })}
        <div>
          <p className="noMargin">List A</p>
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div>
          <p className="noMargin">List B</p>
        </div>
      </div>
    );
  };

  const likert5_2 = (questionKey) => {
    const alternatives = [1, 2, 3, 4, 5];

    return (
      <div className="grid-container fifths noPadding nonoGap">
        {alternatives.map((alternative) => {
          return checkIfLast() ? (
            <Link to={props.nextStep}>
              <button
                className="likert5"
                onClick={() => onAnswerGiven(questionKey, alternative)}
              >
                {alternative}
              </button>
            </Link>
          ) : (
            <button
              className="likert5"
              onClick={() => onAnswerGiven(questionKey, alternative)}
            >
              {alternative}
            </button>
          );
        })}

        <div className="likert5-2">
          <p>Strongly disagree</p>
        </div>
        <div></div>
        <div className="likert5-2">
          <p>Neither agree nor disagree</p>
        </div>
        <div></div>
        <div className="likert5-2">
          <p>Strongly agree</p>
        </div>
      </div>
    );
  };

  // const likert5 = (questionKey) => {
  //   const alternatives = [
  //     "Much more A than the others",
  //     "Slightly more A than the others",
  //     "Slightly more B than the others",
  //     "About the same",
  //     "Much more B than the others",
  //     "Slightly more C than the others",
  //     "Much more C than the others",
  //   ];

  //   return (
  //     <div className="grid-container sevenths noPadding nonoGap">
  //       {alternatives.map((alternative) => {
  //         return (
  //           <button
  //             className="likert5"
  //             onClick={() => onAnswerGiven(questionKey, alternative)}
  //           >
  //             {alternative}
  //           </button>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  const checkIfLast = () => {
    return currentQuestion >= Object.keys(questionnaire.questions).length;
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

  return !redirect ? (
    <div>
      {questionnaire !== null ? (
        <div className="grid-container full questionnaire">
          <div
            className="grid-container full questionnaire2"
            onAnimationEnd={() => setWobble(0)}
            wobble={wobble}
          >
            {checkIfButtons(questionnaire.questions[currentQuestion].input) ? (
              <p className="label">
                {questionnaire.questions[currentQuestion].key}/
                {Object.keys(questionnaire.questions).length}.{" "}
                {questionnaire.questions[currentQuestion].text}
              </p>
            ) : (
              <label
                className="label"
                htmlFor="answer"
                value={questionnaire.questions[currentQuestion].text}
              >
                {questionnaire.questions[currentQuestion].key}/
                {Object.keys(questionnaire.questions).length}.{" "}
                {questionnaire.questions[currentQuestion].text}
              </label>
            )}
            {createAlternatives(
              questionnaire.questions[currentQuestion].key,
              questionnaire.questions[currentQuestion].input
            )}
            {checkIfButtons(questionnaire.questions[currentQuestion].input) ? (
              currentQuestion > 1 ? (
                <div className="grid-container full">
                  <button onClick={onBackClick} className="back-button">
                    Back
                  </button>
                </div>
              ) : null
            ) : null}
            <p className="errorMessage">{errorMessage}</p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  ) : (
    <Redirect push to={props.nextStep}></Redirect>
  );
};

export default Questionnaire;
