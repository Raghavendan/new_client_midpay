import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { database, ref, get } from "../firebase";

const Transaction = () => {
  const location = useLocation();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      const params = new URLSearchParams(location.search);
      const custRefNum = params.get("custRefNum");

      if (!custRefNum) {
        setError("No transaction reference number received.");
        setLoading(false);
        return;
      }

      try {
        const transactionRef = ref(database, `transactions/${custRefNum}`);
        const snapshot = await get(transactionRef);

        if (snapshot.exists()) {
          setTransaction(snapshot.val());
        } else {
          setError("Transaction not found in the database.");
        }
      } catch (err) {
        console.error("Error fetching data from Firebase:", err);
        setError("Failed to fetch transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [location.search]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Loading...</h2>
        <p>Processing transaction details.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Transaction Details</h2>
        <p style={{ color: "red" }}>Error: {error}</p>
        <p>Please check your backend server logs.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Transaction Details</h1>
      {transaction && (
        <>
          <p>
            **Transaction Status:** {transaction.payStatus} - {transaction.resp_message}
          </p>
          <p>
            **Amount:** {transaction.PayAmount} INR
          </p>
          <p>
            **Reference Number:** {transaction.CustRefNum}
          </p>
          {transaction.qrString && (
            <div style={{ marginTop: "2rem" }}>
              <h2>Scan to Pay</h2>
              <QRCodeSVG value={transaction.qrString} size={256} />
              <p style={{ marginTop: "1rem" }}>{transaction.qrString}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transaction;
