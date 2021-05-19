import { useState } from "react";
import { Link } from "react-router-dom";
import Progressbar from "../components/Progressbar/Progressbar";

const {
  default: Questionnaire,
} = require("../components/Questionnaire/Questionnaire");

const Personality = () => {
  const [progress, setProgress] = useState(11.67);
  // const [questionnaireStarted, setQuestionnaireStarted] = useState(false);

  const progressForwardCallback = () => {
    setProgress(progress + 1.67);
  };

  const progressBackCallback = () => {
    setProgress(progress - 1.67);
  };
  return (
    <div>
      <Progressbar progress={progress} />
      <div className="grid-container full space-top">
        <h5>Personality type</h5>
        <Questionnaire
          questionnaireId="Up6074Y5O"
          nextStep="/genres"
          progressForwardCallback={progressForwardCallback}
          progressBackCallback={progressBackCallback}
        />

        {/* Below: With explanation to what/why */}
        {/* {!questionnaireStarted ? (
          <div>
            <div className="grid-container full nextBtnContainer ">
              <div>
                <p className="bottomDescription">
                  Please indicate how well the following statements apply to you
                  on a scale from 1 (disagree strongly) to 7 (agree strongly).
                </p>
                <button
                  onClick={() => setQuestionnaireStarted(true)}
                  style={{ marginTop: "5%" }}
                >
                  Next
                </button>
              </div>

              <Link to="/genres">
                <button
                  onClick={() => setQuestionnaireStarted(true)}
                  className="back-button"
                >
                  Skip this section
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="bottomDescription" style={{ marginBottom: "5%" }}>
              Please indicate how well the following statements apply to you on
              a scale from 1 (disagree strongly) to 7 (agree strongly).
            </p>
            <Questionnaire
              questionnaireId="Up6074Y5O"
              nextStep="/genres"
              progressForwardCallback={progressForwardCallback}
              progressBackCallback={progressBackCallback}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Personality;
