import "./App.css";
import React, { Component } from "react";
import Movie from "./Movie";
import Movies from "./Movies";
import Genres from "./Genres";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Recommendations from "./Recommendations";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header"></header>

        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route
            exact
            path="/movies"
            render={(props) => (
              <Movies {...props} genres={["Action", "Comedy"]} />
            )}
          /> */}
          <Route exact path="/movies/:genres" component={Movies} />
          <Route exact path="/genres" component={Genres} />
          <Route exact path="/rate" component={Movie} />
          <Route exact path="/recommendations" component={Recommendations} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
