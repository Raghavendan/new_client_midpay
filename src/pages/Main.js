import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { database, ref, get, set } from "../firebase";
import CryptoJS from "crypto-js";

const MainPage = () => {
  const location = useLocation();
  const [username, setUsername] = useState("User");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
    }
  }, [location.state]);

  const generateCustRefNo = () => {
    return Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
  };

  const getCurrentFormattedDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  const encryptTransaction = (user) => {
    const payload = {
      AuthID: "M00006572",
      AuthKey: "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo",
      CustRefNum: user.custrefno,
      txn_Amount: user.amount,
      PaymentDate: user.paymentdate,
      ContactNo: user.mobile,
      EmailId: user.email,
      // Now redirects to a frontend page with a GET method
      CallbackURL: "https://nonseampay.vercel.app/transaction",
      IntegrationType: "seamless", // Using redirect type for this flow
      adf1: "NA",
      adf2: "NA",
      adf3: "NA",
      MOP: "UPI",
      MOPType: "UPI",
      MOPDetails: "I",
    };

    const keyValueString = JSON.stringify(payload);

    console.log("🔍 Payload to Encrypt:", keyValueString);

    const key = CryptoJS.enc.Utf8.parse(payload.AuthKey.padEnd(32, "0"));
    const iv = CryptoJS.enc.Utf8.parse(payload.AuthKey.substring(0, 16));

    const encrypted = CryptoJS.AES.encrypt(keyValueString, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  };

  const handleStartPayment = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const matchedUser = Object.values(usersData).find(
          (user) => user.name === username
        );

        if (matchedUser) {
          const fullUserData = {
            ...matchedUser,
            custrefno: generateCustRefNo(),
            amount,
            paymentdate: getCurrentFormattedDateTime(),
          };

          localStorage.setItem(
            "currentAuthKey",
            "Qv0rg4oN8cS9sm6PS3rr6fu7MN2FB0Oo"
          );
          localStorage.setItem("currentCustRefNum", fullUserData.custrefno);

          const encryptedData = encryptTransaction(fullUserData);

          const encryptedRef = ref(
            database,
            `encrypted/${fullUserData.custrefno}`
          );
          await set(encryptedRef, encryptedData);

          // Form creation and submit
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://dashboard.skill-pay.in/pay/paymentinit";
          form.target = "_self";

          const authIdField = document.createElement("input");
          authIdField.type = "hidden";
          authIdField.name = "AuthID";
          authIdField.value = "M00006572";

          const encDataField = document.createElement("input");
          encDataField.type = "hidden";
          encDataField.name = "encData";
          encDataField.value = encryptedData;

          form.appendChild(authIdField);
          form.appendChild(encDataField);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          alert("User not found.");
        }
      }
    } catch (error) {
      console.error("❌ Error processing transaction:", error);
      alert("An error occurred while processing the payment.");
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
