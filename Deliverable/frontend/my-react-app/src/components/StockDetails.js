import React, { useState, useEffect } from "react";
import { Table, Container, Alert, Spinner, Carousel } from "react-bootstrap";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./StockDetails.css";

const StockDetails = ({ symbol }) => {
  const [stockInfo, setStockInfo] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      }
    };

    fetchStockInfo();
  }, [symbol]);

  // Transform stock data for the chart
  const transformedData = stockInfo
    .map(([date, details]) => ({
      date,
      open: details["1. open"],
      high: details["2. high"],
      low: details["3. low"],
      close: details["4. close"],
      volume: details["5. volume"],
    }))
    .reverse();

  // inspiration for graph: https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
  // inspiration for carousel slider: https://react-bootstrap.netlify.app/docs/components/carousel/
  return (
    <Container className="stock-details-container">
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Carousel>
          <Carousel.Item>
            <div className="carousel-content">
              <ResponsiveContainer width="100%" height={450}>
                <h4>Stock Details for {symbol}</h4>
                <LineChart
                  data={transformedData}
                  margin={{
                    top: 20,
                    right: 50,
                    left: 50,
                    bottom: 40,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="open"
                    stroke="#8884d8"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="high"
                    stroke="#82ca9d"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="low"
                    stroke="#ffc658"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="close"
                    stroke="#ff7300"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="volume"
                    stroke="#a4de6c"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="carousel-content">
              <h4>Stock Details for {symbol}</h4>
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
            </div>
          </Carousel.Item>
        </Carousel>
      )}
    </Container>
  );
};

export default StockDetails;
