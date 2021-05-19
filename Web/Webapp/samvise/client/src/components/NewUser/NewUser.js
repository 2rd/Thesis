import * as axios from "axios";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
const ObjectID = require("mongodb").ObjectID;

const NewUser = ({ history }) => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const { setAuthData } = useContext(authContext);

  useEffect(() => {
    setUserId(generateUserId());
  }, []);

  const handleSubmit = () => {
    register(userId);
  };

  const register = async (userId) => {
    try {
      const registrationReq = await axios
        .post("/auth/register", {
          userId: userId,
        })
        .then(() => login(userId));
    } catch (err) {
      setError(err.response.data);
      console.log(err.response.data);
    }
  };

  const login = async (userId) => {
    try {
      const loginReq = await axios.post("/auth/login", {
        userId: userId,
      });
      setAuthData(loginReq.data);
      history.replace("/demography");
    } catch (err) {
      setError(err.response.data);
      console.log(err.response.data);
    }
  };

  const generateUserId = () => {
    // let userId = Math.random().toString(9).substr(2, 10);
    const userId = new ObjectID();
    return userId;
  };

  return (
    <div className="bottom-container">
      <div className="grid-container thirds">
        <Link to="/">
          <button className="back-button">Back</button>
        </Link>
        <button onClick={handleSubmit}>I agree, start the survey</button>
        <div></div>
      </div>
    </div>
  );
};

export default NewUser;
