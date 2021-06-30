import React from "react";
import LoginAndSignup from "../../Components/Login&SignupBtn";

export default function HomePage(props) {
  return (
    <React.Fragment>
      <h1>Welcome!</h1>

      <LoginAndSignup type="login" />
      <LoginAndSignup type="signup" />
    </React.Fragment>
  );
}
