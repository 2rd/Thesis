import * as axios from "axios";
import { useContext, useState } from "react";
import { authContext } from "../../contexts/AuthContext";

const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthData } = useContext(authContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
    history.replace("/");
  };

  const login = async (username, password) => {
    const loginReq = await axios.post("http://localhost:5000/auth/login", {
      username: username,
      password: password,
    });
    setAuthData(loginReq.data);
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
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default Login;
