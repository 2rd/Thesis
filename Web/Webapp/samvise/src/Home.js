function Home({ history }) {
  return (
    <div className="grid-container full">
      <h4>
        Welcome to SAmVisE - A research project exploring the power of visual
        features in movie recommender systems.
      </h4>
      <button onClick={() => history.replace("/register")}>Participate</button>
      <p>
        Already registered? <br></br>
        <a href="/login">Sign in</a>
      </p>
    </div>
  );
}

export default Home;
