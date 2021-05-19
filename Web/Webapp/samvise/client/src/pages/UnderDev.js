import * as axios from "axios";
import { useContext, useState } from "react";

const UnderDev = ({ history }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    register(email);
  };

  const register = async (email) => {
    try {
      const registrationReq = await axios
        .post("/registeremail", {
          email: email,
        })
        .then(() => history.replace("/newsletterConfirmation"));
    } catch (err) {
      setError(err.response.data);
      console.log(err.response.data);
    }
  };

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    if (name === "email") {
      setEmail(value);
    }
  };

  return (
    <div className="grid-container full info">
      <h4>Welcome to SAmVisE</h4>

      <p>
        {" "}
        A research project exploring the power of visual features in movie
        recommender systems.
      </p>
      <div className="info-container">
        <p>
          The user study will be open for participation within the coming weeks.
          When that time comes, all participation would be highly appreciated!
          By entering your email below, you will get a notification once the
          user study begins.
        </p>
      </div>
      <form
        className="grid-container full loginContainer"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={handleInputChange}
        ></input>
        <p className="errorMessage">{error}</p>
        <button type="submit">Register</button>
        <p className="tinytext">
          Your email will only be used once to notify you about the study, and
          deleted after the notification is sent.
        </p>
        {/* <Link to="/about">
          <button className="back-button">Back</button>
        </Link> */}

        {/* <p>
          Already registered? <br></br>
          <Link to="/register">Sign in</Link>
        </p> */}
      </form>
    </div>
  );
};

export default UnderDev;
