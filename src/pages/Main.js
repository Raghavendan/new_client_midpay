// src/pages/MainPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const MainPage = () => {
  const location = useLocation();
  const [username, setUsername] = useState("User");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
    }
  }, [location.state]);

  const handleStartPayment = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const res = await fetch("https://nonseam-pay.onrender.com/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, amount }),
      });

      const data = await res.text(); // Payment gateway may return HTML

      // Open the payment gateway page directly
      const paymentWindow = window.open("", "_self");
      paymentWindow.document.write(data);
    } catch (error) {
      console.error("❌ Payment Error:", error);
      alert("Error starting payment");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🎉 Welcome, {username}!</h1>
      <p>You’ve successfully logged in.</p>

      <div style={{ marginTop: "2rem" }}>
        <input
          type="number"
          placeholder="Enter amount (INR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "200px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleStartPayment}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Payment
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/upi-intent">
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to UPI Payment
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
