import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

const Register = ({ setShowLogin, setRegistrationMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const registerData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(
        "https://mcsbt-integration-paula.ew.r.appspot.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRegistrationMessage(data.message); // Show registration success message
        setShowLogin(true); // Switch back to the login form
      } else {
        alert("Registration failed: " + data.message);
      }
    } catch (error) {
      alert("Registration request failed");
    }
  };

  return (
    <div>
      <Container width="50%">
        <h2>Register</h2>
        <p>Please create your account below.</p>
        <Form width="5px" onSubmit={handleRegister}>
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
            Register
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Register;
