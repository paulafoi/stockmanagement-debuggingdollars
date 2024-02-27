import React from "react";
import { Container, Navbar } from "react-bootstrap";
import PortfolioOverview from "./components/PortfolioOverview";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">DebuggingDollars</Navbar.Brand>
        </Container>
      </Navbar>
      <Container style={{ marginTop: "20px", marginBottom: "20px" }}>
        <PortfolioOverview />
      </Container>
      <div className="footer mt-auto py-3 bg-light">
        <Container>
          <span className="text-muted">© 2024 DebuggingDollars</span>
        </Container>
      </div>
    </>
  );
};

export default App;
