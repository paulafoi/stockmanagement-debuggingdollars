import React, { useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import PortfolioOverview from "./components/PortfolioOverview";
import Login from "./components/LogIn";
import Register from "./components/Register";
import "./App.css";

const App = () => {
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [registrationMessage, setRegistrationMessage] = useState("");

  //manage switch btw login and registration
  const toggleForm = () => {
    setShowLogin(!showLogin);
    setRegistrationMessage("");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://mcsbt-integration-paula.ew.r.appspot.com/handleLogout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setLoginSuccessful(false);
        document.cookie = "session=; Max-Age=0";
      } else {
        alert("Logout failed: " + data.message);
      }
    } catch (error) {
      alert("Logout request failed");
    }
  };

  return (
    <>
      <Navbar className="navbar" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">DebuggingDollars</Navbar.Brand>
          {loginSuccessful && (
            <Nav>
              <Button onClick={handleLogout} className="button">
                Logout
              </Button>
            </Nav>
          )}
        </Container>
      </Navbar>
      <Container className="main-content">
        {!loginSuccessful ? (
          <>
            {showLogin ? (
              <>
                <Login setLoginSuccessful={setLoginSuccessful} />
                {registrationMessage && (
                  <div className="alert alert-success" role="alert">
                    {registrationMessage}
                  </div>
                )}
                <Button variant="link" onClick={toggleForm}>
                  Don't have an account? Register
                </Button>
              </>
            ) : (
              <>
                <Register
                  setLoginSuccessful={setLoginSuccessful}
                  setShowLogin={setShowLogin}
                  setRegistrationMessage={setRegistrationMessage}
                />
                <Button variant="link" onClick={toggleForm}>
                  Already have an account? Log In
                </Button>
              </>
            )}
          </>
        ) : (
          <PortfolioOverview />
        )}
      </Container>
      <div className="footer">
        <Container>
          <span className="text-muted">© 2024 DebuggingDollars</span>
        </Container>
      </div>
    </>
  );
};

export default App;
