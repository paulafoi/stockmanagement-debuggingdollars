import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ setLoginSuccessful }) => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Prepare the data to be sent
    const loginData = {
      userID: userID,
      password: password,
    };

    try {
      // Send a POST request to the backend
      const response = await fetch("http://127.0.0.1:5000/handleLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Assuming the response is JSON
      const data = await response.json();

      if (response.ok) {
        // If login is successful
        setLoginSuccessful(true);
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Login request failed", error);
      alert("Login request failed");
    }
  };

  return (
    <Container width="20px">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>UserID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter userID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
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
        <Button variant="primary" type="submit" class="btn btn-success">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
