// Import necessary libraries and components
import React, { useState } from "react";
import useFormValidation from "../../hooks/useFormValidation";
import { Box, TextField } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import LogoComp from "../../layouts/LogoComp";
import tyreLogin from "../../assets/images/tyre_login.jpg";
import arrow from "../../assets/images/arrow_1.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // if needed later

  // Regex for email validation
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation function for useFormValidation
  const validateEmail = (values) => {
    let errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regexEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  // Use custom hook
  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    { email: "" },
    validateEmail
  );

  const onSubmit = () => {
    // If validation passes
    console.log("Reset link sent to:", values.email);
    navigate("/getotp");
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="w-screen h-screen absolute bg-white flex flex-col md:flex-row">
      {/* Logo */}
      <LogoComp variant="login" />

      {/* Back arrow */}
      <img
        src={arrow}
        alt="back_arrow"
        className="h-6 w-6 relative left-[41px] top-[120px] cursor-pointer"
        onClick={handleBack}
      />

      {/* Left Side: Forgot Password Form */}
      <div className="flex flex-col justify-center items-center flex-1 p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Heading */}
          <div className="space-y-2 text-center">
            <h1 className="text-[40px] font-[700] text-left md:text-4xl">
              Reset Password
            </h1>
            <p className="text-gray-700 text-left text-sm font-normal text-[20px]">
              Enter your email to receive a reset code
            </p>
          </div>

          {/* Form */}
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { width: "100%" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#012622" },
                "&:hover fieldset": { borderColor: "#012622" },
                "&.Mui-focused fieldset": { borderColor: "#012622" },
              },
              "& .MuiInputBase-input": { color: "black" },
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiInputLabel-root.Mui-focused": { color: "black" },
              "& .MuiFormLabel-asterisk": { color: "red" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              id="outlined-email"
              label="Enter Email"
              type="email"
              name="email"
              required
              value={values.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email || " "} // reserve space to avoid shifting
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[55px] bg-[#012622] text-white font-medium rounded-lg text-base px-5 py-2.5 hover:opacity-90 focus:ring-4 focus:ring-[#012622] focus:outline-none"
            >
              Get Code
            </button>
          </Box>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="hidden md:flex flex-1 justify-center items-center relative">
        <div className="w-full h-screen rounded-3xl overflow-hidden relative p-6">
          <img
            src={tyreLogin}
            alt="tyre_login"
            className="w-full h-full object-cover rounded-3xl"
          />
          <h1 className="absolute bottom-20 left-90 transform -translate-x-1/2 text-white text-3xl font-bold">
            TYRE RECYCLING SPECIALISTS
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
