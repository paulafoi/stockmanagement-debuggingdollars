import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import PortfolioOverview from "./components/PortfolioOverview";
import Login from "./components/LogIn";
import "./App.css";

const App = () => {
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  return (
    <>
      <Navbar className="navbar" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">DebuggingDollars</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="main-content">
        {!loginSuccessful ? (
          <Login setLoginSuccessful={setLoginSuccessful} />
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
