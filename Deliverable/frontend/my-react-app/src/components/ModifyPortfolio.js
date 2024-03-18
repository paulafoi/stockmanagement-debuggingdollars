import React, { useState } from "react";
import { Form, Button, Container, Modal } from "react-bootstrap";

const ModifyPortfolio = ({ onPortfolioChange }) => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [operation, setOperation] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleModifyPortfolio = async (e) => {
    e.preventDefault();
    let data;
    setShowModal(false); // Ensure modal is not shown initially
    try {
      const response = await fetch(
        `https://mcsbt-integration-paula.ew.r.appspot.com/modifyPortfolio`,
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
      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Network response was not ok");
      }
    } catch (error) {
      setMessage(error.message || `Failed to modify portfolio.`);
      setShowModal(true); // Show modal on error
      return;
    }
    setMessage(data.message);
    setShowModal(true); // Show modal on success

    try {
      onPortfolioChange();
    } catch (error) {
      console.error("Failed to update portfolio overview:", error);
    }
  };

  return (
    <Container
      className="mb-5"
      style={{
        width: "80%",
        backgroundColor: "#e8f5e9",
        float: "left",
        padding: "20px",
      }}
    >
      <Form onSubmit={handleModifyPortfolio}>
        <div
          style={{
            display: "flex",
            marginBottom: "1rem",
            alignItems: "center",
          }}
        >
          <Form.Group
            controlId="stockSymbol"
            style={{ flex: 1, marginRight: "10px" }}
          >
            <Form.Label>Stock Symbol</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter stock symbol"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group
            controlId="quantity"
            style={{ flex: 1, marginRight: "10px" }}
          >
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              required
            />
          </Form.Group>

          <div
            style={{
              flex: 1,
              marginRight: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Form.Check
              type="radio"
              label="Add"
              name="operation"
              id="add"
              value="ADD"
              checked={operation === "ADD"}
              onChange={(e) => setOperation(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Remove"
              name="operation"
              id="remove"
              value="REMOVE"
              checked={operation === "REMOVE"}
              onChange={(e) => setOperation(e.target.value)}
            />
          </div>

          <Button className="button" variant="primary" type="submit">
            Modify Portfolio
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Portfolio Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ModifyPortfolio;
