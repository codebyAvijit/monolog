import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormHelperText } from "@mui/material";

const DatePickerComp = ({
  label,
  value,
  onChange,
  placeholder = "Select Date",
  width = "100%", // Default to 100% for responsiveness
  error = false,
  helperText = "",
  isActive = false,
  maxWidth = "100%",
  ...props
}) => {
  return (
    <div
      className="w-full relative"
      style={{
        maxWidth: maxWidth,
      }}
    >
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            error,
            placeholder,
            sx: {
              width: width,
              height: "60px",
              // outlined border
              "& .MuiOutlinedInput-root": {
                height: "60px !important",
                "& fieldset": {
                  borderColor: "#e5e7eb",
                },
              },
              // hover
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "#e5e7eb",
              },
              // focused
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#012622",
                borderWidth: "1px",
              },
              // error border overrides
              "& .MuiOutlinedInput-root.Mui-error fieldset": {
                borderColor: "#d32f2f",
                borderWidth: "1px",
              },
              "& .MuiOutlinedInput-root.Mui-focused.Mui-error fieldset": {
                borderColor: "#d32f2f",
              },
              // text style
              "& .MuiPickersInputBase-sectionContent": {
                fontSize: "14px !important",
                fontWeight: "400 !important",
                fontFamily: "ProximaNova, sans-serif !important",
                color: "#012622 !important",
                lineHeight: "20px !important",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "14px !important",
                fontWeight: "400 !important",
                fontFamily: "ProximaNova, sans-serif !important",
                color: "#012622 !important",
              },
              // label style
              "& .MuiInputLabel-root": {
                fontSize: "14px !important",
                fontWeight: "400 !important",
                fontFamily: "ProximaNova, sans-serif !important",
                color: "#012622 !important",
                height: "60px !important",
              },
              "& .MuiPickersOutlinedInput-root": {
                height: "100%",
              },
              "& .MuiInputLabel-root.Mui-error": {
                color: "#d32f2f !important",
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                boxShadow: "none !important",
              },
              "& .MuiSvgIcon-root": {
                color: "#6b7280",
              },
            },
          },
        }}
        {...props}
      />

      {/* Always render FormHelperText to keep height consistent */}
      <FormHelperText
        error={error}
        sx={{
          position: "absolute",
          bottom: "-22px",
          left: "0px",
          margin: 0,
          fontSize: "12px",
          minHeight: "16px",
        }}
      >
        {helperText || " "}
      </FormHelperText>
    </div>
  );
};

export default DatePickerComp;
