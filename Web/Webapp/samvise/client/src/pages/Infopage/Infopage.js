import { Link } from "react-router-dom";
import NewUser from "../../components/NewUser/NewUser";
import "./infopage.css";

const Infopage = ({ history }) => {
  return (
    <div>
      <div className="grid-container full info">
        <h3>Before you participate</h3>
        <div className="info-container">
          {/* <h5>About the project</h5> */}
          <p>
            How can we create good video recommendations when there is little
            data available about videos? You can help the research on this topic
            by taking 15 minutes to complete the following survey.
          </p>
          <h5>Tasks</h5>
          <p>
            If you agree to participate in the survey, you will be asked to
            perform the following tasks:
          </p>
          <ol>
            <li>Answer demographic questions</li>
            <li>Answer to personality questions</li>
            <li>Give ratings to five movies of your choice</li>
            <li>
              Answer questions about recommendations made based on your ratings
            </li>
            <li>Answer questions about the usability of the website</li>
          </ol>
          <h5>Benefits</h5>
          <p>
            You might get some ideas for movies to watch. Except for that, there
            is no direct benefit to you from taking part in ths study.
          </p>
          <h5>Risks/discomforts</h5>
          <p>
            You may feel uncomfortable answering some of the questions. You are
            of course free to stop participating at any time. Participation is
            anonymous, meaning that none of the answers are linked to personally
            identifiable information.
          </p>
          <h5>Confidentiality</h5>
          <p>
            The data will be handled as confidentially as possible. To minimize
            the risks to confidentiality, none others than the researchers
            involved in this study are given access to the data.
          </p>
          <h5>Compensation</h5>
          <p>
            Participants who complete the survey will be offered the option to
            participate in a draw for a 300NOK (~ €30) Netflix gift card. <br />
            <br />
            The Netflix gift card is only valid in the following countries:
            Australia, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic,
            Denmark, Germany, Spain, Estonia, France, Greece, Hungary, Ireland,
            Italy, Latvia, Lithuania, Luxembourg, Malta, The Netherlands,
            Norway, Austria, Poland, Portugal, Romania, Switzerland, Slovakia,
            Slovenia, Finland, Sweden, United Kingdom.
          </p>
          <h5>Rights</h5>
          <p>
            Participation in is completely voluntary. You are free to decline
            taking part in the study, and you are free to stop taking part in
            the survey at any time.
          </p>
          <h5>Questions</h5>
          <p>
            If you have any questions about the research, please feel free to
            contact us (see contact information below). If you agree to take
            part in the study, please click on the "I agree, start the survey"
            button below.
          </p>
          <h5>Contact</h5>
          <p>
            Potential inquiries can be directed to: <br />
            Tord Kvifte, University of Bergen,{" "}
            <a href="mailto: Tord.Kvifte@student.uib.no">
              Tord.Kvifte@student.uib.no
            </a>{" "}
            .
          </p>
        </div>
      </div>
      <NewUser history={history} />
      <div className="space-bottom100"></div>
      {/* <div className="bottom-container">
        <div className="grid-container thirds">
          <Link to="/">
            <button className="back-button">Back</button>
          </Link>
          <Link to="/register">
            <button>Register</button>
          </Link>
          <div></div>
        </div>
      </div> */}
    </div>
  );
};

export default Infopage;
