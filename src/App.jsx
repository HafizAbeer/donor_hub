import React from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerificationCode from "./pages/VerificationCode";
import AppSidebar from "./pages/Home";

function App() {
  return (
    <>
      <Login />
      <Signup />
      <ForgotPassword />
      <VerificationCode />
      <AppSidebar />
    </>
  );
}

export default App;
