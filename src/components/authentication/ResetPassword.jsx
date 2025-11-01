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
import arrow from "../../assets/images/arrow_1.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePasswords = (values) => {
    let errors = {};
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password should be at least 8 characters";
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
      errors.password = "Password must contain at least one special character";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.password && values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    { password: "", confirmPassword: "" },
    validatePasswords
  );

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleBack = () => navigate(-1);

  const handleSave = () => {
    console.log("Password reset successfully");
    navigate("/");
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      <LogoComp variant="login" />

      {/* Left Side: Reset Password Form */}
      <div className="flex justify-center items-center flex-1 p-6 md:p-8 relative mt-10">
        {/* Back arrow - Absolutely positioned, won't affect layout */}
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 md:top-8 md:left-8 p-2 hover:bg-gray-100 rounded-full transition-colors group z-10"
          aria-label="Go back"
        >
          <img
            src={arrow}
            alt="back"
            className="h-6 w-6 transition-transform group-hover:-translate-x-1"
          />
        </button>

        <div className="w-full max-w-md space-y-6">
          {/* <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#012622]">
              Set Password
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Create a strong password to secure your account
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs sm:text-sm text-gray-600">
            <p className="font-medium text-[#012622] mb-1">
              Password must contain:
            </p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One special character (!@#$%^&*)</li>
            </ul>
          </div> */}

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
            onSubmit={handleSubmit(handleSave)}
          >
            <div className="space-y-4">
              <TextField
                label="Password"
                id="outlined-password"
                name="password"
                required
                value={values.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password || " "}
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
                sx={{ mb: 3 }}
              />

              <TextField
                label="Confirm Password"
                id="outlined-confirmPassword"
                name="confirmPassword"
                required
                value={values.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword || " "}
                type={showConfirmPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </div>

            <button
              type="submit"
              className="w-full h-[50px] sm:h-[55px] bg-[#012622] text-white font-medium rounded-lg text-base px-5 py-2.5 hover:bg-[#013a33] focus:ring-4 focus:ring-[#012622]/20 focus:outline-none transition-all"
            >
              Save Password
            </button>
          </Box>

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

export default ResetPassword;
