// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import UserOverview from "./components/UserOverview";
import StockDetails from "./components/StockDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:userID" element={<UserOverview />} />
          <Route path="/stockinfo/:symbol" element={<StockDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
