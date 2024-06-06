import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import InvoiceList from "./components/InvoiceList";
import CreateInvoice from "./components/CreateInvoice";
import UpdateInvoice from "./components/UpdateInvoice";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<InvoiceList/>} />
          <Route path="/create-invoice" element={<CreateInvoice/>} />
          <Route path="/update-invoice/:invoiceId" element={<UpdateInvoice/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
