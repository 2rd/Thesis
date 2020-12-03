import * as axios from "axios";
import { useState } from "react";

const Login = () => {
  const login = async (username, password) => {
    axios.post("http://localhost:5000/auth/login", {
      username: username,
      password: password,
    });
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
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
    <div>
      <form className="grid-container full" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
          ></input>
        </label>
        <label>
          Password:
          <input
            type="text"
            name="password"
            value={password}
            onChange={handleInputChange}
          ></input>
        </label>
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
};

export default Login;
