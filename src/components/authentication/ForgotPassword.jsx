// Import necessary libraries and components
import React from "react";
import useFormValidation from "../../hooks/useFormValidation";
import { Box, TextField } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import LogoComp from "../../layouts/LogoComp";
import tyreLogin from "../../assets/images/tyre_login.jpg";
import arrow from "../../assets/images/arrow_1.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

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
    console.log("Reset link sent to:", values.email);
    navigate("/getotp");
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="w-screen h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Logo */}
      <LogoComp variant="login" />

      {/* Left Side: Forgot Password Form */}
      <div className="flex flex-col justify-center items-center flex-1 p-6 md:p-8 mt-[-40px]">
        {/* Back arrow - Below logo, on the left */}
        <button
          onClick={handleBack}
          className="self-start mb-8 p-2 hover:bg-gray-100 rounded-full transition-colors group"
          aria-label="Go back"
        >
          <img
            src={arrow}
            alt="back"
            className="h-6 w-6 transition-transform group-hover:-translate-x-1"
          />
        </button>

        <div className="w-full max-w-md space-y-6">
          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#012622]">
              Forgot Password
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
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
              helperText={errors.email || " "}
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[50px] sm:h-[55px] bg-[#012622] text-white font-medium rounded-lg text-base px-5 py-2.5 hover:bg-[#013a33] focus:ring-4 focus:ring-[#012622]/20 focus:outline-none transition-all"
            >
              Get Code
            </button>
          </Box>

          {/* Back to Login Link */}
          <div className="text-center">
            <NavLink
              to="/"
              className="text-sm text-gray-600 hover:text-[#012622] transition-colors"
            >
              Remember your password?{" "}
              <span className="font-medium text-[#012622]">Login</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Right Side: Image - Hidden on Mobile, Visible on Desktop */}
      <div className="hidden lg:flex flex-1 justify-center items-center bg-gray-50">
        <div className="w-full h-full relative p-6">
          <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-2xl">
            <img
              src={tyreLogin}
              alt="Tyre Recycling"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                TYRE RECYCLING
                <br />
                SPECIALISTS
              </h2>
              <p className="text-white/90 text-sm md:text-base mt-3 max-w-md">
                Sustainable solutions for a greener tomorrow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
