// src/components/reusableComps/FormFieldComp.jsx
import React from "react";
import { TextField } from "@mui/material";

const inputBoxSX = {
  "& .MuiOutlinedInput-root": {
    height: "60px",
    borderRadius: "8px", //  Consistent border radius
    "& fieldset": {
      borderColor: "#e5e7eb",
      borderRadius: "8px", //  Consistent border radius
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

  // Fixed helper text area
  "& .MuiFormHelperText-root": {
    position: "absolute",
    bottom: "-22px",
    left: "0px",
    margin: "0",
    fontSize: "12px",
    minHeight: "16px",
  },
};

const FormFieldComp = ({
  placeholder,
  label,
  name,
  value,
  onChange,
  error = "",
  helperText = "",
  fullWidth = false,
  width = "334px",
  height = "60px",
  sx = {},
  ...rest
}) => {
  //  Merge sx properly
  const mergedSx = {
    ...inputBoxSX,
    ...sx,
    "& .MuiOutlinedInput-root": {
      ...inputBoxSX["& .MuiOutlinedInput-root"],
      ...(sx["& .MuiOutlinedInput-root"] || {}),
    },
    "& .MuiOutlinedInput-input": {
      ...inputBoxSX["& .MuiOutlinedInput-input"],
      ...(sx["& .MuiOutlinedInput-input"] || {}),
    },
    "& .MuiInputLabel-root": {
      ...inputBoxSX["& .MuiInputLabel-root"],
      ...(sx["& .MuiInputLabel-root"] || {}),
    },
    width: "100%",
    height: "60px !important",
  };

  return (
    <div
      style={{
        position: "relative",
        width: fullWidth ? "100%" : "100%",
        maxWidth: fullWidth ? "none" : width,
        height: "60px",
      }}
      className="w-full"
    >
      <TextField
        label={label}
        placeholder={placeholder}
        name={name}
        required
        value={value}
        onChange={onChange}
        fullWidth={fullWidth}
        error={Boolean(error)}
        helperText={helperText || " "}
        sx={mergedSx}
        {...rest}
      />
    </div>
  );
};

export default FormFieldComp;
