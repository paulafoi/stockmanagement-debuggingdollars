import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Container, Row, Col, Alert } from "react-bootstrap";
import StockDetails from "./StockDetails";

const PortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState({ symbols: {} }); // Initialize symbols as an empty object
  const [totalValue, setTotalValue] = useState(0);
  const [error, setError] = useState("");
  const userId = "user1";

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(
          `http://mcsbt-integration-paula.appspot.com/${userId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPortfolio({ symbols: data.symbols || {} });
        setTotalValue(data.total_value || 0);
      } catch (error) {
        setError("Failed to fetch portfolio. Please try again later.");
      }
    };

    fetchPortfolio();
  }, []);

  const PortfolioAccordion = () => {
    // Convert the symbols object into an array including the symbol names
    const symbolsArray = Object.entries(portfolio.symbols).map(
      ([symbol, details]) => ({
        symbol,
        ...details,
      })
    );

    return (
      <Accordion defaultActiveKey="0" flush>
        {symbolsArray.map((stock, index) => (
          <Accordion.Item eventKey={String(index)} key={stock.symbol}>
            <Accordion.Header>
              {stock.symbol}: {stock.quantity} shares - Value: ${stock.value}
            </Accordion.Header>
            <Accordion.Body>
              <StockDetails symbol={stock.symbol} details={stock} />
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
          <h3>Portfolio Overview for {userId}</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <h5>Total Portfolio Value: ${totalValue}</h5>
          {Object.keys(portfolio.symbols).length > 0 ? (
            <PortfolioAccordion />
          ) : (
            !error && <p>Loading portfolio...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PortfolioOverview;
