import React, { useState } from "react";
import useFormValidation from "../hooks/useFormValidation";
// import logo from "../assets/images/logo.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import tyreLogin from "../assets/images/tyre_login.jpg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LogoComp from "./LogoComp";
import arrow from "../assets/images/arrow_1.png";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation function for useFormValidation

  const validatePasswords = (values) => {
    let errors = {};

    // Password validations
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password should be at least 8 characters";
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
      errors.password = "Password must contain at least one special character";
    }

    // Confirm password validations
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.password && values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // Prevents the input from losing focus
  };

  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    { password: "", confirmPassword: "" },
    validatePasswords
  );
  const handleBack = () => {
    navigate(-1); // goes back one step in browser history
  };

  const handleSave = () => {
    console.log("Password reset successfully");
    navigate("/");
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col md:flex-row">
      {/* Logo */}

      <LogoComp variant="login" />
      <img
        src={arrow}
        alt="back_arrow"
        className="h-6 w-6 relative left-[41px] top-[120px]"
        onClick={handleBack}
      />
      {/* Left Side: Login Form */}
      <div className="flex flex-col justify-center items-center flex-1 p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Heading + Subtext */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Set Password</h1>
            {/* <p className="text-gray-700">
              Welcome Back! Please enter your details
            </p> */}
          </div>
          {/* Password */}
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { width: "100%" }, // consistent width
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
            onSubmit={handleSubmit(handleSave)}
          >
            <TextField
              label="Password"
              id="outlined-password"
              name="password"
              required
              value={values.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password || " "} // reserve space to avoid shifting
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 5 }}
            />

            <TextField
              label="Confirm Password"
              id="outlined-confirmPassword"
              name="confirmPassword"
              required
              value={values.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword || " "} // reserve space to avoid shifting
              type={showConfirmPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-[55px] bg-[#012622] text-white font-medium rounded-lg text-base px-5 py-2.5 hover:opacity-90 focus:ring-4 focus:ring-[#012622] focus:outline-none"
            >
              Save
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

export default ResetPassword;
