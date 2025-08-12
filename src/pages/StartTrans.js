import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { database, ref, get } from "../firebase"; // your frontend firebase config

const StartTrans = () => {
  const location = useLocation();
  const amount = location.state?.amount || "";
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const snapshot = await get(ref(database, "paymentDetails"));
        if (snapshot.exists()) {
          setDetails(snapshot.val());
        } else {
          console.log("No data found in Firebase");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Transaction Details</h2>
      <p>Entered Amount: ₹{amount}</p>
      {details ? (
        <div>
          <p>Username: {details.username}</p>
          <p>Order ID: {details.orderId}</p>
          <p>Status: {details.status}</p>
        </div>
      ) : (
        <p>Loading details...</p>
      )}
    </div>
  );
};

export default StartTrans;
