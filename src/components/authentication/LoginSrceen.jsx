// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFormValidation from "../../hooks/useFormValidation";
import { NavLink, useNavigate } from "react-router-dom";
import tyreLogin from "../../assets/images/tyre_login.jpg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { InputAdornment, IconButton, Alert } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LogoComp from "../../layouts/LogoComp";
import { login, clearError } from "../../redux/authSlice";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    { email: "", password: "" },
    validateLogin
  );
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async () => {
    try {
      await dispatch(
        login({ email: values.email, password: values.password })
      ).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Logo */}
      <LogoComp variant="login" />

      {/* Left Side: Login Form */}
      <div className="flex justify-center items-center flex-1 p-6 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#012622]">
              Login
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
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
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

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
                className="text-xs sm:text-sm font-normal text-[#E98A15] hover:text-[#d17a0f] underline transition-colors"
              >
                Forgot password?
              </NavLink>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] sm:h-[55px] bg-[#012622] text-white font-medium rounded-lg text-base px-5 py-2.5 hover:bg-[#013a33] focus:ring-4 focus:ring-[#012622]/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </Box>
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
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Text Overlay */}
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

export default LoginScreen;
