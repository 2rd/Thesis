import "./App.css";
import React, { Component } from "react";
import Movie from "./components/Movie/Movie";
import Movies from "./components/Movies/Movies";
import Genres from "./components/Genres/Genres";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Recommendations from "./components/Recommendations/Recommendations";
import Login from "./components/Login/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header"></header>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
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
