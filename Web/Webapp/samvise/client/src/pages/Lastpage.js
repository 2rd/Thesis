import * as axios from "axios";
import { useContext, useState } from "react";
import { authContext } from "../contexts/AuthContext";
import Progressbar from "../components/Progressbar/Progressbar";

const UnderDev = ({ history }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(98.5);
  const { auth } = useContext(authContext);

  const handleSubmit = (e) => {
    postCompletionTime();
    if (email.length > 0) {
      e.preventDefault();
      register(email);
    } else {
      history.replace("/thankyou");
      //   setAuthData(null);
    }
  };

  const onSkipClick = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    } else {
      history.replace("/thankyou");
    }
  };

  const postCompletionTime = async () => {
    try {
      const res = await axios.post(
        "auth/update",
        { completionTime: Date.now(), progress: "complete" },
        { headers: { "auth-token": auth.data } }
      );
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const register = async (email) => {
    try {
      const registrationReq = await axios
        .post("/registeremail", {
          email: email,
        })
        .then(() => {
          //   setAuthData(null);
          history.replace("/thankyou");
        });
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
    <div>
      <Progressbar progress={progress} />
      <div className="grid-container full info">
        <div>
          <h5>Netflix gift card </h5>
          <p style={{ padding: "0 3%" }}>
            If you would like to participate in the draw for a Netflix gift
            card* worth 300 NOK (~ €30), please enter your email before clicking
            "next".
          </p>
        </div>
        <form
          className="grid-container full loginContainer"
          onSubmit={handleSubmit}
          style={{ marginTop: "0", paddingTop: "0" }}
        >
          <label htmlFor="email">Email (optional):</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleInputChange}
          ></input>
          <p className="tinytext">
            Your email will not be associated with the other answers you have
            given.
          </p>
          <p className="errorMessage">{error}</p>
          <div className="grid-container halves">
            <button onClick={(e) => onSkipClick}>Skip</button>
            <button type="submit">Next</button>
          </div>
          <p
            className="tinytext"
            style={{ textAlign: "left", padding: "0 5%", marginBottom: "0" }}
          >
            *The Netflix gift card is only valid in the following countries:
            Australia, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic,
            Denmark, Germany, Spain, Estonia, France, Greece, Hungary, Ireland,
            Italy, Latvia, Lithuania, Luxembourg, Malta, The Netherlands,
            Norway, Austria, Poland, Portugal, Romania, Switzerland, Slovakia,
            Slovenia, Finland, Sweden, United Kingdom.
          </p>
          <p
            className="tinytext"
            style={{ textAlign: "left", padding: "0 5%", marginBottom: "0" }}
          >
            The winner will be contacted by March 30, 2021.
          </p>
        </form>
      </div>
    </div>
  );
};

export default UnderDev;
