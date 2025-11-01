// Import necessary libraries and components
import React from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

const defaultSx = {
  height: "60px",
  "& .MuiSelect-select": {
    height: "60px",
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    fontSize: "14px !important",
    fontWeight: "400 !important",
    fontFamily: "ProximaNova, sans-serif !important",
    color: "#012622 !important",
  },
  "& .MuiSelect-select:focus": {
    outline: "none",
    boxShadow: "none",
  },
  "& .MuiSelect-select:focus-visible": {
    outline: "none",
    boxShadow: "none",
  },

  // base border
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e5e7eb",
  },

  // hover
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e5e7eb",
  },

  // focused
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#012622", // or your theme color
    borderWidth: "1px",
  },

  // 🚨 error overrides (highest priority)
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d32f2f", // red
    borderWidth: "1px",
  },
  "& .MuiOutlinedInput-root.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline":
    {
      borderColor: "#d32f2f", // keep red even on focus
    },
};

const SelectMenuComp = ({
  label = "Select",
  value,
  onChange,
  options = [],
  sx = {},
  labelId = "select-label",
  selectId = "select",
  error = false,
  helperText = "",
  fullWidth = false,
  ...rest
}) => (
  <div
    style={{
      position: "relative",
      width: "100%",
    }}
    className="w-full"
  >
    <FormControl
      variant="outlined"
      sx={{
        height: "60px",
        width: "100%",
        maxWidth: { xs: "100%", sm: "334px", lg: "334px", xl: "334px" }, // Responsive: 100% on mobile, 334px on tablet+

        // Fixed helper text positioning
        "& .MuiFormHelperText-root": {
          position: "absolute",
          bottom: "-22px",
          left: "0px",
          margin: "0",
          fontSize: "12px",
          minHeight: "16px",
        },
      }}
      error={error}
    >
      <InputLabel
        id={labelId}
        sx={{
          fontSize: "14px !important",
          fontWeight: "400 !important",
          fontFamily: "ProximaNova, sans-serif !important",
          color: "#012622 !important",
          "&.Mui-focused": { color: "#012622 !important" },
          "&.MuiInputLabel-shrink": { color: "#012622 !important" },
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={selectId}
        value={value}
        label={label}
        onChange={onChange}
        sx={{ ...defaultSx, ...sx }}
        {...rest}
      >
        {options.map((opt) =>
          typeof opt === "string" ? (
            <MenuItem
              key={opt}
              value={opt}
              sx={{
                fontSize: "14px !important",
                fontWeight: "400 !important",
                fontFamily: "ProximaNova, sans-serif !important",
                color: "#012622 !important",
              }}
            >
              {opt}
            </MenuItem>
          ) : (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={{
                fontSize: "14px !important",
                fontWeight: "400 !important",
                fontFamily: "ProximaNova, sans-serif !important",
                color: "#012622 !important",
              }}
            >
              {opt.label}
            </MenuItem>
          )
        )}
      </Select>

      {/* Always render FormHelperText to reserve space */}
      <FormHelperText>{helperText || " "}</FormHelperText>
    </FormControl>
  </div>
);

export default SelectMenuComp;
