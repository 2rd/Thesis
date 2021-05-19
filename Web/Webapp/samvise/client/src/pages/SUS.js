import { useState } from "react";
import { Link } from "react-router-dom";
import Progressbar from "../components/Progressbar/Progressbar";
const {
  default: Questionnaire,
} = require("../components/Questionnaire/Questionnaire");

const SUS = () => {
  const [progress, setProgress] = useState(80);
  const [questionnaireStarted, setQuestionnaireStarted] = useState(false);

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
        <h4>Usability</h4>

        {!questionnaireStarted ? (
          <div>
            <div className="grid-container full nextBtnContainer ">
              <div
                style={{
                  backgroundColor: "var(--color4)",
                  paddingBottom: "2%",
                  paddingTop: "2%",
                }}
              >
                <p className="bottomDescription">
                  The following questions relate to the user friendliness of
                  this website (referred to as "the system").
                </p>
                <button
                  onClick={() => setQuestionnaireStarted(true)}
                  style={{ marginTop: "5%" }}
                >
                  Next
                </button>
              </div>

              <Link to="/competition">
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
          <Questionnaire
            questionnaireId="mEl42KTtD"
            nextStep="/competition"
            progressForwardCallback={progressForwardCallback}
            progressBackCallback={progressBackCallback}
          />
        )}
      </div>
    </div>
  );
};

export default SUS;
