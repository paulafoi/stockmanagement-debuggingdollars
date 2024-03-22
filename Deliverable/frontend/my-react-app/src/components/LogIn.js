import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ setLoginSuccessful }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Prepare the data to be sent
    const loginData = {
      username: username,
      password: password,
    };

    try {
      // Send a POST request to the backend
      const response = await fetch(
        "https://mcsbt-integration-paula.ew.r.appspot.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
          credentials: "include", // for setting session-cookie in browser
        }
      );

      // Assuming the response is JSON
      const data = await response.json();

      if (response.ok) {
        // If login is successful
        setLoginSuccessful(true);
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      alert("Login request failed");
    }
  };

  return (
    <Container width="10px">
      <h2>Log In</h2>
      <p>Please enter your login details below</p>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="btn btn-success">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
