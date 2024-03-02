import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Container, Row, Col, Alert } from "react-bootstrap";
import StockDetails from "./StockDetails";
import { useParams } from "react-router-dom"; // Import useParams

const PortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState({});
  const [error, setError] = useState("");
  const { userId } = useParams(); // Use useParams to get userId from the URL

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(
          `https://mcsbt-integration-paula.ew.r.appspot.com/${userId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPortfolio(data);
      } catch (error) {
        setError("Failed to fetch portfolio. Please try again later.");
      }
    };

    fetchPortfolio();
  }, [userId]); // Add userId as a dependency to useEffect

  const PortfolioAccordion = () => {
    return (
      <Accordion defaultActiveKey="0" flush>
        {Object.entries(portfolio).map(([symbol, quantity], index) => (
          <Accordion.Item eventKey={String(index)} key={symbol}>
            <Accordion.Header>
              {symbol}: {quantity} shares
            </Accordion.Header>
            <Accordion.Body>
              {/* Render StockDetails for each symbol */}
              <StockDetails symbol={symbol} quantity={quantity} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <h2>Portfolio Overview</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {Object.keys(portfolio).length > 0 ? (
            <PortfolioAccordion />
          ) : (
            !error && <p>Loading portfolio...</p> // Show loading state when there's no error and portfolio is empty
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PortfolioOverview;
