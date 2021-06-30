import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./main.css";
import HomePage from "./Pages/HomePage/HomePage";
import Login from "./Pages/HomePage/Login";
import UserAuthentication from "./Pages/HomePage/UserAuthentication";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/UserAuthentication"
            component={UserAuthentication}
          />
          <Route exact path="/Login" component={Login} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
