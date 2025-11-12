// src/components/ButtonComp.jsx
import React from "react";
import { Button } from "@mui/material";

const ButtonComp = ({
  label,
  children,
  onClick,
  variant = "contained",
  fullWidth = false,
  sx = {},
  ...rest
}) => {
  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      sx={{
        backgroundColor: variant === "contained" ? "#012622" : "transparent",
        color: variant === "contained" ? "white" : "#012622",
        textTransform: "none",
        height: "60px",
        padding: "0 20px",
        whiteSpace: "nowrap",
        borderColor: variant === "outlined" ? "#012622" : undefined,
        "&:hover": {
          borderColor: variant === "outlined" ? "#012622" : undefined,
          backgroundColor: variant === "contained" ? "#0a3a34" : "transparent",
        },
        ...sx, // sx can override any of the above
      }}
      onClick={onClick}
      {...rest}
    >
      {children || label}
    </Button>
  );
};

export default ButtonComp;
