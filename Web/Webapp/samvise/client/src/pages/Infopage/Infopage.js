import { Link } from "react-router-dom";
import "./infopage.css";

const Infopage = ({ history }) => {
  return (
    <div>
      <div className="grid-container full info">
        <h3>Before you register</h3>
        <div className="info-container">
          <h5>About the project</h5>
          <p>
            The purpose of the project is to explore the power of utilizing
            novel content data from movies in order to generate recommendations
            for users.
          </p>
          <h5>Tasks</h5>
          <p>
            Completing the survey will take about 15 minutes. You will be asked
            to perform the following tasks after registration:
          </p>
          <ol>
            <li>Anwer questionnaire ~5min</li>
            <li>Rate movies ~5min</li>
            <li>Evaluate recommendations ~5min</li>
          </ol>
          <h5>The value of your contribution</h5>
          <p>
            By providing your feedback, we can learn which recommender is
            preferred by real users. The opinion of the end user is what really
            matters when it comes to the quality of recommenders.
          </p>
          <h5>How is the data handled?</h5>
          <p>
            The data collected in this web app will only be used for this
            research project. The data will not be shared with any third-party
            vendors. Participation is anonymous, meaning that none of the data
            stored can be traced back to you.
          </p>
        </div>
      </div>
      <div className="space-bottom50"></div>
      <div className="bottom-container">
        <div className="nextBtnContainer">
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Infopage;
