import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import StockDetails from "./StockDetails";
import "bootstrap/dist/css/bootstrap.min.css"; // Keep this import here
import "./PortfolioOverview.css";

const PortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
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
        setPortfolio(data.symbols || {});
        setTotalValue(data.total_value || 0);
      } catch (error) {
        setError("Failed to fetch portfolio. Please try again later.");
      }
    };

    fetchPortfolio();
  }, []);

  const handleStockSelection = (symbol) => {
    setSelectedStock(symbol);
  };

  return (
    <Container fluid className="portfolio-overview">
      <Row>
        <Col xs={12} className="app-header">
          <h2>Portfolio Overview for {userId}</h2>
          {portfolio ? (
            <>
              <h5>Total Portfolio Value: ${totalValue}</h5>
              <p className="select-stock-instruction">
                Select a stock to see details
              </p>
            </>
          ) : (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={4} className="sidebar">
          {portfolio ? (
            Object.entries(portfolio).map(([symbol, details]) => (
              <div
                className="stock-item"
                key={symbol}
                onClick={() => handleStockSelection(symbol)}
              >
                <span className="stock-symbol">{symbol}:</span>
                <span className="stock-details">
                  {details.quantity} shares - ${details.value} in total value
                </span>
              </div>
            ))
          ) : (
            <div>Loading portfolio...</div>
          )}
        </Col>
        <Col xs={8} className="main-content">
          {error && <Alert variant="danger">{error}</Alert>}
          {selectedStock && <StockDetails symbol={selectedStock} />}
        </Col>
      </Row>
    </Container>
  );
};

export default PortfolioOverview;
