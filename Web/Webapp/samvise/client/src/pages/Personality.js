const {
  default: Questionnaire,
} = require("../components/Questionnaire/Questionnaire");

const Personality = () => {
  return (
    <div className="grid-container full space-top">
      <h4>Personality type</h4>
      <Questionnaire questionnaireId="Up6074Y5O" nextStep="/genres" />
    </div>
  );
};

export default Personality;
