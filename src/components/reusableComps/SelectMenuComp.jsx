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
  borderRadius: "8px",
  width: "100%", //  CRITICAL: This makes it fill parent container
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

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e5e7eb",
    borderRadius: "8px",
  },

  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e5e7eb",
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#012622",
    borderWidth: "1px",
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d32f2f",
    borderWidth: "1px",
  },
  "& .MuiOutlinedInput-root.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline":
    {
      borderColor: "#d32f2f",
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
}) => {
  const mergedSx = {
    ...defaultSx,
    ...sx,
    "& .MuiInputBase-input": {
      ...defaultSx["& .MuiSelect-select"],
      ...(sx["& .MuiInputBase-input"] || {}),
    },
    "& .MuiInputLabel-root": {
      ...(sx["& .MuiInputLabel-root"] || {}),
    },
  };

  return (
    <FormControl
      variant="outlined"
      sx={{
        height: "60px",
        width: "100%", //  CRITICAL: FormControl fills parent

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
      fullWidth={fullWidth}
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
          ...(sx["& .MuiInputLabel-root"] || {}),
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
        sx={mergedSx}
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

      <FormHelperText>{helperText || " "}</FormHelperText>
    </FormControl>
  );
};

export default SelectMenuComp;
