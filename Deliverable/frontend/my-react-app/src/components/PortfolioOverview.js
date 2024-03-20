import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import StockDetails from "./StockDetails";
import ModifyPortfolio from "./ModifyPortfolio";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PortfolioOverview.css";

const PortfolioOverview = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      const response = await fetch(
        `https://mcsbt-integration-paula.ew.r.appspot.com/overview`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // Check if the error is specifically about having no stocks
        if (data.error === "No stocks found for the user") {
          setPortfolio({});
          setTotalValue(0.0);
          setError("");
        } else {
          // For other errors, throw an error to be caught in the catch block
          throw new Error(data.error || "Network response was not ok");
        }
      } else {
        // If the response is OK, update the portfolio and total value as usual
        setPortfolio(data.symbols || {});
        setTotalValue(data.total_value || 0);
        setError("");
      }
    } catch (error) {
      setError(
        error.message || "Failed to fetch portfolio. Please try again later."
      );
    }
  }, []);

  // useEffect to call fetchPortfolio when the component mounts
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleStockSelection = (symbol) => {
    setSelectedStock(symbol);
  };

  return (
    <Container fluid>
      <Row className="portfolio-overview">
        <Col xs={10} className="app-header">
          <h2>Portfolio Overview</h2>
          {portfolio ? (
            <>
              <h5>Total Portfolio Value: ${totalValue}</h5>
              <ModifyPortfolio onPortfolioChange={fetchPortfolio} />
              <p className="select-stock-instruction" style={{ clear: "both" }}>
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
      <Row className="portfolio-overview">
        <Col xs={3} className="sidebar">
          {portfolio &&
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
            ))}
        </Col>
        <Col xs={7} className="main-content">
          {error && <Alert variant="danger">{error}</Alert>}
          {selectedStock && <StockDetails symbol={selectedStock} />}
        </Col>
      </Row>
    </Container>
  );
};

export default PortfolioOverview;
