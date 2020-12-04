import "./App.css";
import React, { Component } from "react";
import Movie from "./components/Movie/Movie";
import Movies from "./components/Movies/Movies";
import Genres from "./components/Genres/Genres";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Recommendations from "./components/Recommendations/Recommendations";
import Login from "./components/Login/Login";
import Panel from "./components/Panel/Panel";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header"></header>

        <Switch>
          <PrivateRoute exact path="/" component={Panel} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/movies/:genres" component={Movies} />
          <PrivateRoute exact path="/genres" component={Genres} />
          <PrivateRoute exact path="/rate" component={Movie} />
          <PrivateRoute
            exact
            path="/recommendations"
            component={Recommendations}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
