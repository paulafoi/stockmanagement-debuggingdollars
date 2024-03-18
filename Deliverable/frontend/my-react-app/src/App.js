import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import PortfolioOverview from "./components/PortfolioOverview";
import Login from "./components/LogIn";
import Register from "./components/Register";
import "./App.css";

const App = () => {
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [registrationMessage, setRegistrationMessage] = useState("");

  useEffect(() => {
    // Check session when app loads
    const verifySession = async () => {
      try {
        const response = await fetch(
          "http://mcsbt-integration-paula.ew.r.appspot.com/verifySession",
          { credentials: "include" }
        );
        if (response.ok) {
          // If the session is valid, log the user in
          setLoginSuccessful(true);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      }
    };

    verifySession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://mcsbt-integration-paula.ew.r.appspot.com/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        // If the logout is successful, log the user out
        setLoginSuccessful(false);
        // Clear the cookie if it's not httpOnly
        document.cookie =
          "debuggindollars_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        const data = await response.json();
        alert("Logout failed: " + data.message);
      }
    } catch (error) {
      alert("Logout request failed");
    }
  };

  const toggleForm = () => {
    setShowLogin(!showLogin);
    setRegistrationMessage("");
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
