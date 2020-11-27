import { useEffect, useState } from "react";
import * as axios from "axios";

const Questionnaire = (props) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState([]);

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
    const answerObj = {
      userId: "test",
      questionnaireId: "1TwH5KhBs",
      questionKey: questionKey,
      answer: answer,
    };
    let prevAnswers = answers;
    prevAnswers.push(answerObj);
    setAnswers(prevAnswers);
  };

  const onAlternativeCliced = (key, answer) => {
    setCurrentQuestion(key + 1);
    addAnswer(key, answer);
  };

  const submitAnswers = () => {
    for (let answer of answers) {
      postAnswer(answer);
    }
  };

  const postAnswer = async (answer) => {
    const res = await axios.post("http://localhost:5000/answers/add", answer);
    console.log(res.data);
  };

  const createAlternatives = (questionKey, input) => {
    if (input === "likert-5") {
      return likert5(questionKey);
    }
  };

  const likert5 = (questionKey) => {
    const alternatives = [
      "Much more A than B",
      "A little more A than B",
      "About the same",
      "A little more B than A",
      "Much more B than A",
    ];

    return (
      <div className="grid-container fifths">
        {alternatives.map((alternative) => {
          return (
            <button
              className="alternativeBtn"
              onClick={() => onAlternativeCliced(questionKey, alternative)}
            >
              {alternative}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {questionnaire !== null ? (
        <div>
          {currentQuestion < Object.keys(questionnaire.questions).length + 1 ? (
            <ol
              className="grid-container full"
              start={questionnaire.questions[currentQuestion].key}
            >
              <li key={questionnaire.questions[currentQuestion].key}>
                <p>{questionnaire.questions[currentQuestion].text}</p>
                {createAlternatives(
                  questionnaire.questions[currentQuestion].key,
                  questionnaire.questions[currentQuestion].input
                )}
              </li>
              {/* {[...Object.values(questionnaire.questions)]
            .map((question) => {
              return (
                <li key={question.key}>
                  <p>{question.text}</p>
                  {createAlternatives(question.key, question.input)}
                </li>
              );
            })} */}
            </ol>
          ) : (
            <div className="grid-container full">
              <button onClick={submitAnswers}>Submit</button>
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
