import React, { useState, useEffect } from "react";

export default function Signup() {
  const [response, setResponse] = useState(null);
  const onRegister = () => {
    const [usernameInput, emailInput, passwordInput] =
      document.querySelectorAll("input");

    fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 200) {
          setResponse("Success");
          console.log("took if branch");
        } else {
          setResponse(res);
          console.log(res);
          console.log("took else branch");
        }
      });
    console.log("test");
  };

  useEffect(() => {
    console.log(response);
  }, [response]);

  return (
    <React.Fragment>
      <input placeholder="Username " />
      <input placeholder="Email " />
      <input type="password" placeholder="Password " />

      <button onClick={onRegister}>Register</button>

      {response ? (
        <h4>
          {response.status === 200
            ? "Success! You should get an email to verify your account."
            : response.message}
        </h4>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}
