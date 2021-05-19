import { useState } from "react";
import Progressbar from "../components/Progressbar/Progressbar";

const {
  default: Questionnaire,
} = require("../components/Questionnaire/Questionnaire");

const Demography = () => {
  const [progress, setProgress] = useState(1.67);

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
        <h5>Demography</h5>
        <Questionnaire
          questionnaireId="Z4t7Z18tQE"
          nextStep="/personality"
          progressForwardCallback={progressForwardCallback}
          progressBackCallback={progressBackCallback}
        />
      </div>
    </div>
  );
};

export default Demography;
