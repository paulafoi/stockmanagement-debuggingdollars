import React from "react";
import { Container, Navbar } from "react-bootstrap";
import PortfolioOverview from "./components/PortfolioOverview";
import "./App.css"; // Import your app.css file

const App = () => {
  return (
    <>
      <Navbar className="navbar" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">DebuggingDollars</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="main-content">
        <PortfolioOverview />
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
