import React, { useState, useEffect } from "react";
import { Table, Container, Alert, Spinner } from "react-bootstrap";
import "./StockDetails.css";

const StockDetails = ({ symbol }) => {
  const [stockInfo, setStockInfo] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add a loading state

  useEffect(() => {
    setLoading(true); // Start loading
    const fetchStockInfo = async () => {
      try {
        const response = await fetch(
          `https://mcsbt-integration-paula.appspot.com/stockinfo/${symbol}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStockInfo(data);
      } catch (error) {
        setError(
          `Failed to fetch stock details for ${symbol}. Please try again later.`
        );
      } finally {
        setLoading(false); // Stop loading whether there was an error or not
      }
    };

    fetchStockInfo();
  }, [symbol]);

  return (
    <Container className="stock-details-container">
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? ( // Check if it's loading
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        stockInfo.length > 0 && (
          <>
            <h3 className="stock-details-header">Stock Details for {symbol}</h3>
            <Table striped bordered hover size="sm" className="stock-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Close</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {stockInfo.map(([date, details], index) => (
                  <tr key={index}>
                    <td>{date}</td>
                    <td>${details["1. open"]}</td>
                    <td>${details["2. high"]}</td>
                    <td>${details["3. low"]}</td>
                    <td>${details["4. close"]}</td>
                    <td>{details["5. volume"]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )
      )}
    </Container>
  );
};

export default StockDetails;
