import React, { Component } from "react";
import { Link } from "react-router-dom";

class LoginAndSignup extends Component {
  render() {
    return (
      <button className="btn btn-primary m-3">
        <Link
          to={this.props.type === "login" ? "/Login" : "/UserAuthentication"}
        >
          {this.props.type === "login" ? "Login" : "Sign Up"}
        </Link>
      </button>
    );
  }
}

export default LoginAndSignup;
