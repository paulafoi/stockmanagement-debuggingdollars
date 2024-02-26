import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function UserOverview() {
  const { userID } = useParams();
  const [userStocks, setUserStocks] = useState(null);

  useEffect(() => {
    fetch(`http://mcsbt-integration-paula.ew.r.appspot.com/${userID}`)
      .then((response) => response.json())
      .then((data) => setUserStocks(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [userID]);

  if (!userStocks) return <div>Loading...</div>;
  if (userStocks.error) return <div>{userStocks.error}</div>;

  return (
    <div>
      <h1>{userID}'s Stock Portfolio</h1>
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
