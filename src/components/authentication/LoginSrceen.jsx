// Import necessary libraries and components
import React, { useState } from "react";
import useFormValidation from "../../hooks/useFormValidation";
import { NavLink, useNavigate } from "react-router-dom";
import tyreLogin from "../../assets/images/tyre_login.jpg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LogoComp from "../../layouts/LogoComp";

const validateLogin = (values) => {
  let errors = {};
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!regexEmail.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) errors.password = "Password is required";
  return errors;
};

const LoginScreen = () => {
  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    { email: "", password: "" },
    validateLogin
  );
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const onSubmit = () => {
    // Called only if validation passes
    navigate("/dashboard");
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col md:flex-row">
      {/* Logo */}
      <LogoComp variant="login" />

      {/* Left Side: Login Form */}
      <div className="flex justify-center items-center flex-1 p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Login</h1>
            <p className="text-gray-700">
              Welcome Back! Please enter your details
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
            <div className="space-y-4">
              {/* Email */}
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                required
                value={values.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email || " "}
                sx={{ mb: 3 }}
              />

              {/* Password */}
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={values.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || " "}
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
                sx={{ mb: 1 }}
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-4">
              <NavLink
                to="/forget"
                className="text-[12px] font-[400] text-[#E98A15] underline"
              >
                Forgot password?
              </NavLink>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-[55px] bg-[#012622] text-white font-medium rounded-lg text-base px-5 py-2.5 hover:opacity-90 focus:ring-4 focus:ring-[#012622] focus:outline-none"
            >
              Login
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

export default LoginScreen;
