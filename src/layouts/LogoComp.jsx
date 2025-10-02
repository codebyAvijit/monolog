// Import necessary libraries and components
// LogoComp.jsx
import React from "react";
import logo from "../assets/images/logo.jpg";
import { useNavigate } from "react-router-dom";

const LogoComp = ({ variant = "nav" }) => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/dashboard");
  };

  return (
    <div
      onClick={handleHome}
      className={`cursor-pointer ${
        variant === "login"
          ? "absolute top-6 left-6" // login screen
          : "flex items-center" // navbar
      }`}
    >
      <img src={logo} alt="logo" className="h-12 w-auto" />
    </div>
  );
};

export default LogoComp;
