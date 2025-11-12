// src/components/SearchBarComp.jsx
import React from "react";
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SearchBarComp = ({
  onChange,
  value,
  onSearch,
  fullWidth = false, //  Added fullWidth prop
  sx = {},
  ...rest
}) => {
  return (
    <div
      tabIndex="0"
      style={{
        width: fullWidth ? "100%" : "auto", //  Respect fullWidth
        height: "60px",
        display: "flex",
        alignItems: "center",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        outline: "none",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        ...sx,
      }}
      className="
            hover:border-[rgba(0,0,0,0.2)]
            focus-within:border-[rgba(0,0,0,0.2)]
          "
    >
      <OutlinedInput
        fullWidth
        placeholder="Search"
        value={value}
        onChange={onChange}
        startAdornment={
          <InputAdornment position="start" sx={{ ml: 1 }}>
            <SearchIcon sx={{ color: "#6b7280", marginTop: "-2px" }} />
          </InputAdornment>
        }
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          height: "60px",
          "& .MuiOutlinedInput-input": {
            height: "100%",
            boxSizing: "border-box",
            padding: 0,
            fontFamily: "ProximaNova, sans-serif",
            fontSize: "14px",
            marginTop: "-5px",
          },
          ...(sx["& .MuiOutlinedInput-input"] || {}),
        }}
        inputProps={{ "aria-label": "search" }}
        {...rest}
      />

      <IconButton
        onClick={onSearch}
        aria-label="run search"
        sx={{
          height: "40px",
          width: "40px",
          bgcolor: "#F7931E",
          "&:hover": { bgcolor: "#e07c00" },
          marginRight: "10px",
          borderRadius: "4px",
          flexShrink: 0, //  Prevent button from shrinking
        }}
      >
        <ArrowForwardIosIcon sx={{ color: "white", fontSize: "16px" }} />
      </IconButton>
    </div>
  );
};

export default SearchBarComp;
