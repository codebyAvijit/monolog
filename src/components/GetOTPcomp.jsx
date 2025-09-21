import React from "react";
import useFormValidation from "../hooks/useFormValidation";
import OtpInput from "react-otp-input";
import { NavLink, useNavigate } from "react-router-dom";
import LogoComp from "./LogoComp";
import { Box } from "@mui/system";
import arrow from "../assets/images/arrow_1.png";
import tyreLogin from "../assets/images/tyre_login.jpg";
import iconClock from "../assets/images/iconClock.png";

// Validation function
const validateOTP = (values) => {
  let errors = {};
  if (!values.otp) {
    errors.otp = "OTP is required";
  } else if (values.otp.length < 6) {
    errors.otp = "OTP must be 6 digits";
  } else if (!/^\d{6}$/.test(values.otp)) {
    errors.otp = "OTP must contain only digits";
  }
  return errors;
};

const GetOTPcomp = () => {
  const navigate = useNavigate();

  // Custom hook with initial state
  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    { otp: "" },
    validateOTP
  );

  const handleBack = () => {
    navigate(-1); // go back one step
  };

  return (
    <div className="w-screen h-screen absolute bg-white flex flex-col md:flex-row">
      {/* Logo */}
      <LogoComp variant="login" />

      {/* Back Arrow */}
      <img
        src={arrow}
        alt="back_arrow"
        className="h-6 w-6 relative left-[41px] top-[120px] cursor-pointer"
        onClick={handleBack}
      />

      {/* Left Side: OTP Form */}
      <div className="flex flex-col justify-center items-center flex-1 p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Heading */}
          <div className="space-y-2 text-left">
            <h1 className="text-[40px] font-[700] md:text-4xl">Enter Code</h1>
            <p className="text-[rgba(1, 38, 34, 1)] text-sm md:text-base font-normal">
              Enter the security code we sent on your phone/email.
            </p>
          </div>

          {/* Form */}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(() => {
              console.log("OTP submitted:", values.otp);
              navigate("/resetpassword");
            })}
          >
            {/* OTP Input */}
            <OtpInput
              value={values.otp}
              onChange={(otp) => handleChange({ name: "otp", value: otp })}
              numInputs={6}
              shouldAutoFocus
              containerStyle="flex justify-between gap-2 w-full"
              renderSeparator={null}
              renderInput={(props) => (
                <input
                  {...props}
                  className="flex-1 min-w-[40px] h-[70px] border rounded-[4px] text-center text-xl font-semibold 
                             focus:outline-none focus:ring-2 focus:ring-[#012622]"
                />
              )}
            />

            {/* Error Message (reserve space so layout doesn’t jump) */}
            <p className="text-red-500 text-sm h-5 mt-2">{errors.otp || " "}</p>

            {/* Resend Section */}
            <div className="flex mt-2 gap-2 items-center text-[12px]">
              <p>Didn't get the Text Message?</p>
              <NavLink
                to="/forget"
                className="text-[12px] font-[400] text-[#E98A15] underline"
              >
                Resend it
              </NavLink>
              <img src={iconClock} alt="icon_clock" className="h-4 w-4" />
              <p>45s</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[55px] mt-6 bg-[#012622] text-white font-medium rounded-lg 
                         text-base px-5 py-2.5 hover:opacity-90 focus:ring-4 focus:ring-[#012622] 
                         focus:outline-none"
            >
              Submit
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

export default GetOTPcomp;
