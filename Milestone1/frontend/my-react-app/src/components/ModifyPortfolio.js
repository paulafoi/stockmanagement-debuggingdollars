import React, { useState } from "react";
import { Alert, Form, Button, Container } from "react-bootstrap";

const ModifyPortfolio = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [operation, setOperation] = useState("");
  const [message, setMessage] = useState("");

  const handleModifyPortfolio = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://mcsbt-integration-paula.appspot.com/modifyPortfolio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock_symbol: stockSymbol,
            quantity: quantity,
            operation: operation,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Check for a redirect in the response
      if (response.redirected) {
        window.location.href = response.url; // This will cause the page to reload to the given URL
      } else {
        const data = await response.json();
        setMessage(data.message);
        // Optionally, force a reload if you need to re-fetch any data
        window.location.reload();
      }
    } catch (error) {
      setMessage("Failed to modify portfolio. Please try again.");
    }
  };

  return (
    <Container
      className="mb-5"
      style={{
        width: "60%",
        backgroundColor: "#e8f5e9",
        float: "left",
        padding: "0.5rem",
      }}
    >
      <Form onSubmit={handleModifyPortfolio}>
        <div
          style={{
            display: "flex",
            marginBottom: "1.5rem",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, marginRight: "20px" }}>
            <Form.Label htmlFor="stockSymbol">Stock Symbol</Form.Label>
            <Form.Control
              id="stockSymbol"
              type="text"
              placeholder="Enter stock symbol"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1, marginRight: "20px" }}>
            <Form.Label htmlFor="quantity">Quantity</Form.Label>
            <Form.Control
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              required
            />
          </div>
          <div style={{ flex: 1, marginRight: "20px", marginTop: "30px" }}>
            <Form.Check
              inline
              type="radio"
              label="Add"
              name="operation"
              id="add"
              value="ADD"
              checked={operation === "ADD"}
              onChange={(e) => setOperation(e.target.value)}
            />
            <Form.Check
              inline
              type="radio"
              backgroundColor="#1c2a24"
              label="Remove"
              name="operation"
              id="remove"
              value="REMOVE"
              checked={operation === "REMOVE"}
              onChange={(e) => setOperation(e.target.value)}
            />
          </div>
          <Button
            className="button"
            style={{ marginTop: "30px" }}
            variant="primary"
            type="submit"
          >
            Modify Portfolio
          </Button>
        </div>

        {message && <Alert variant="info">{message}</Alert>}
      </Form>
    </Container>
  );
};

export default ModifyPortfolio;
