import React from "react";
import { useLocation } from "react-router-dom";

const UpiIntent = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const amount = query.get("amount") || "0";
  const custrefno = query.get("custrefno") || "";

  const upiId = "user@bank"; // You can make this dynamic as well if available
  const payeeName = "User Name";

  // Generate UPI URL with dynamic amount & custrefno as reference
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`PaymentRef:${custrefno}`)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    upiUrl
  )}`;

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <h2>UPI Payment</h2>
      <p>
        Pay to UPI ID: <strong>{upiId}</strong>
      </p>
      <p>Amount: ₹{amount}</p>
      <img src={qrCodeUrl} alt="UPI QR Code" />
    </div>
  );
};

export default UpiIntent;
