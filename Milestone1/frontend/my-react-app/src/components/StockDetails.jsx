import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function StockDetails() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStockData(null);
    setLoading(true);
    setError(null);

    fetch(`http://mcsbt-integration-paula.ew.r.appspot.com/stockinfo/${symbol}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStockData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error.message);
        setLoading(false);
      });
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error}</div>;

  if (!Array.isArray(stockData)) {
    return <div>Error: Data is not in expected format</div>;
  }

  return (
    <div>
      <h1>Stock Details for {symbol}</h1>
      <table>
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
          {stockData.map(([date, details]) => (
            <tr key={date}>
              <td>{date}</td>
              <td>{details["1. open"]}</td>
              <td>{details["2. high"]}</td>
              <td>{details["3. low"]}</td>
              <td>{details["4. close"]}</td>
              <td>{details["5. volume"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockDetails;
