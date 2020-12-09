import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="grid-container full narrow">
      <h4>
        Welcome to SAmVisE - A research project exploring the power of visual
        features in movie recommender systems.
      </h4>
      <Link to="/about">
        <button>Participate</button>
      </Link>

      <p>
        Already registered? <br></br>
        <a href="/login">Sign in</a>
      </p>
    </div>
  );
}

export default Home;
