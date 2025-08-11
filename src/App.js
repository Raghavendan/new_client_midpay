import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MainPage from "./pages/Main";
import UpiIntent from "./pages/UpiIntent";
import Transaction from "./pages/Transaction";
import Trans from "./pages/NewTrans"; // as per your setup

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/trans" element={<Trans />} />
          <Route path="/upi-intent" element={<UpiIntent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
