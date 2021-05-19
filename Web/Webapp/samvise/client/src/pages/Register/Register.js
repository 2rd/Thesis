import * as axios from "axios";
import "./register.css";
import { useContext, useState } from "react";
import { authContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Register = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthData } = useContext(authContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    register(username, password);
  };

  const register = async (username, password) => {
    try {
      const registrationReq = await axios
        .post("/auth/register", {
          username: username,
          password: password,
        })
        .then(() => login(username, password));
    } catch (err) {
      setError(err.response.data);
      console.log(err.response.data);
    }
  };

  const login = async (username, password) => {
    try {
      const loginReq = await axios.post("/auth/login", {
        username: username,
        password: password,
      });
      setAuthData(loginReq.data);
      history.replace("/demography");
    } catch (err) {
      setError(err.response.data);
      console.log(err.response.data);
    }
  };

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    if (name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
    // let creds = credentials;
    // creds[name] = value;
    // setCredentials(creds);
  };
  return (
    <div className="grid-container full">
      <form
        className="grid-container full loginContainer"
        onSubmit={handleSubmit}
      >
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={handleInputChange}
        ></input>
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          name="password"
          type="password"
          id="password"
          value={password}
          onChange={handleInputChange}
        ></input>
        <p className="errorMessage">{error}</p>
        <button type="submit">Register</button>
        <Link to="/about">
          <button className="back-button">Back</button>
        </Link>

        <p>
          Already registered? <br></br>
          <Link to="/register">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
