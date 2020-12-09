const { default: Questionnaire } = require("../Questionnaire/Questionnaire");

const Demography = () => {
  return (
    <div className="grid-container full space-top">
      <h4>Demography</h4>
      <Questionnaire questionnaireId="Z4t7Z18tQE" nextStep="/personality" />
    </div>
  );
};

export default Demography;
