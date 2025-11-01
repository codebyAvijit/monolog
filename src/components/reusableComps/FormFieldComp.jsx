// Import necessary libraries and components
// src/components/reusableComps/FormFieldComp.jsx
import React from "react";
import { TextField } from "@mui/material";

const inputBoxSX = {
  "& .MuiOutlinedInput-root": {
    height: "60px",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
  },

  // Input text + placeholder
  "& .MuiOutlinedInput-input": {
    padding: "0 14px",
    fontSize: "14px",
    fontFamily: "ProximaNova, sans-serif",
    fontWeight: 400,
    color: "#012622",
    "&::placeholder": {
      color: "#012622",
      opacity: 1,
      fontSize: "14px",
      fontFamily: "ProximaNova, sans-serif",
      fontWeight: 400,
    },
  },

  // Label styling
  "& .MuiInputLabel-root": {
    fontSize: "14px",
    fontFamily: "ProximaNova, sans-serif",
    fontWeight: 400,
    color: "#012622",
    "&.Mui-focused": {
      color: "#012622",
    },
    "&.MuiInputLabel-shrink": {
      color: "#012622",
    },
  },

  // Fixed helper text area to prevent shifting
  "& .MuiFormHelperText-root": {
    position: "absolute",
    bottom: "-22px", // Position helper text below the input
    left: "0px",
    margin: "0",
    fontSize: "12px",
    minHeight: "16px", // Reserve space for helper text
  },
};

const FormFieldComp = ({
  placeholder,
  name,
  value,
  onChange,
  error = "",
  helperText = "",
  fullWidth = false,
  width = "334px",
  height = "60px",
  ...rest
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: fullWidth ? "100%" : "100%",
        maxWidth: fullWidth ? "none" : width,
        height: "60px",
        // marginBottom: "26px", // Space for helper text + some padding
      }}
      className="w-full"
    >
      <TextField
        placeholder={placeholder}
        name={name}
        required
        value={value}
        onChange={onChange}
        fullWidth={fullWidth}
        error={Boolean(error)}
        helperText={helperText || " "} // Always provide space for helper text
        sx={{
          ...inputBoxSX,
          ...rest.sx,
          width: "100%",
          height: "60px !important",
        }}
        {...rest}
      />
    </div>
  );
};

export default FormFieldComp;
