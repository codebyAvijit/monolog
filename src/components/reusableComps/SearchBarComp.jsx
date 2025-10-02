// Import necessary libraries and components
// src/components/SearchBarComp.jsx
import React from "react";
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const SearchBarComp = ({ onChange, value, onSearch }) => {
  return (
    <div
      tabIndex="0"
      className="
        w-[334px] max-w-full h-[60px] flex items-center
        border border-[#e5e7eb]        
        hover:border-[rgba(0,0,0,0.2)] 
        focus-within:border-[rgba(0,0,0,0.2)] 
        rounded-lg shadow-sm
        outline-none
      "
    >
      <OutlinedInput
        fullWidth
        placeholder="Search"
        value={value}
        onChange={onChange}
        startAdornment={
          <InputAdornment position="start" sx={{ ml: 1 }}>
            <SearchIcon sx={{ color: "#6b7280" }} />
          </InputAdornment>
        }
        sx={{
          // remove the default outline
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
          },
        }}
        inputProps={{ "aria-label": "search" }}
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
        }}
      >
        <ArrowForwardIosIcon sx={{ color: "white", fontSize: "16px" }} />
      </IconButton>
    </div>
  );
};

export default SearchBarComp;
