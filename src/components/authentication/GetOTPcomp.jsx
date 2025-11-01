// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import useFormValidation from "../../hooks/useFormValidation";
import OtpInput from "react-otp-input";
import { NavLink, useNavigate } from "react-router-dom";
import LogoComp from "../../layouts/LogoComp";
import { Box } from "@mui/system";
import arrow from "../../assets/images/arrow_1.png";
import tyreLogin from "../../assets/images/tyre_login.jpg";
import iconClock from "../../assets/images/iconClock.png";

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
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const { values, errors, handleChange, handleSubmit } = useFormValidation(
    { otp: "" },
    validateOTP
  );

  const handleBack = () => navigate(-1);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = () => {
    if (canResend) {
      console.log("Resending OTP...");
      setTimer(45);
      setCanResend(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      <LogoComp variant="login" />

      <div className="flex flex-col justify-center items-center flex-1 p-6 md:p-8">
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
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#012622]">
              Enter Code
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Enter the security code we sent to your phone/email.
            </p>
          </div>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(() => {
              console.log("OTP submitted:", values.otp);
              navigate("/resetpassword");
            })}
          >
            <div className="mb-4">
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
                    className="flex-1 min-w-[40px] max-w-[60px] h-[60px] sm:h-[70px] border-2 border-[#012622] rounded-lg text-center text-xl font-semibold 
                               focus:outline-none focus:ring-2 focus:ring-[#012622] focus:border-[#012622] transition-all"
                  />
                )}
              />
            </div>

            <p className="text-red-500 text-sm h-5 mb-2">{errors.otp || " "}</p>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span>Didn't get the code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-[#E98A15] hover:text-[#d17a0f] underline transition-colors"
                >
                  Resend it
                </button>
              ) : (
                <span className="text-gray-400">Resend it</span>
              )}
              <div className="flex items-center gap-1">
                <img
                  src={iconClock}
                  alt="timer"
                  className="h-4 w-4 opacity-70"
                />
                <span
                  className={`font-medium ${
                    canResend ? "text-gray-400" : "text-[#012622]"
                  }`}
                >
                  {timer}s
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-[50px] sm:h-[55px] mt-6 bg-[#012622] text-white font-medium rounded-lg 
                         text-base px-5 py-2.5 hover:bg-[#013a33] focus:ring-4 focus:ring-[#012622]/20 
                         focus:outline-none transition-all"
            >
              Submit
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

export default GetOTPcomp;
