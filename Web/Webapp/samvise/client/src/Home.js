import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="grid-container full narrower space-top">
      <h4>Welcome to SAMVISE</h4>
      <p>
        {" "}
        A research project exploring the power of visual and speech features in
        movie recommender systems.
      </p>
      <p>
        <span style={{ textDecoration: "line-through" }}>
          Participate and get the opportunity to win a Netflix gift card worth
          300NOK (30€) !
        </span>{" "}
        (Winner is drawn March 30, 2021)
      </p>
      <Link to="/about">
        <button>Participate</button>
      </Link>

      {/* <p>
        Already registered? <br></br>
        <Link to="/login">Sign in</Link>
      </p> */}
    </div>
  );
}

export default Home;
