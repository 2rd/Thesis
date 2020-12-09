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
import Register from "./components/Register/Register";
import Infopage from "./components/Infopage/Infopage";
import Demography from "./components/Demography/Demography";
import Personality from "./components/Personality/Personality";
import Thankyou from "./components/Thankyou/Thankyou";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header"></header>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={Infopage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <PrivateRoute exact path="/demography" component={Demography} />
          <PrivateRoute exact path="/personality" component={Personality} />
          <PrivateRoute exact path="/movies/:genres" component={Movies} />
          <PrivateRoute exact path="/genres" component={Genres} />
          <PrivateRoute exact path="/rate" component={Movie} />
          <PrivateRoute
            exact
            path="/recommendations"
            component={Recommendations}
          />
          <PrivateRoute exact path="/thankyou" component={Thankyou} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
