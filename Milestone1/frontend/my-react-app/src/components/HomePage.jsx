import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to Debugging Dollars!</h1>
      <p>Please choose which user you are:</p>
      <div>
        <ul>
          <li>
            User1: Click <Link to="/user1">here</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
