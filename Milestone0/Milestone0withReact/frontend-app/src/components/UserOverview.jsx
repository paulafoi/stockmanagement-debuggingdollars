import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UserOverview() {
  const [userStocks, setUserStocks] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/user1`)
      .then((response) => response.json())
      .then((data) => setUserStocks(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [user1]);

  if (!userStocks) return <div>Loading...</div>;
  if (userStocks.error) return <div>{userStocks.error}</div>;

  return (
    <div>
      <h1> User1's Stock Portfolio</h1>
      <p>
        Welcome to your portfolio overview. Please find below all the symbols in
        your portfolio
      </p>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(userStocks).map(([symbol, amount]) => (
            <tr key={symbol}>
              <td>
                <Link to={`/stockinfo/${symbol}`}>{symbol}</Link>
              </td>
              <td>{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserOverview;
