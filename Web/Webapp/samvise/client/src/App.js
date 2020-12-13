import "./App.css";
import React, { Component } from "react";
import Movie from "./pages/Movie";
import Movies from "./pages/Movies";
import Genres from "./pages/Genres";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login/Login";
import Panel from "./pages/Panel";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Register from "./pages/Register/Register";
import Infopage from "./pages/Infopage/Infopage";
import Demography from "./pages/Demography";
import Personality from "./pages/Personality";
import Thankyou from "./pages/Thankyou";

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
