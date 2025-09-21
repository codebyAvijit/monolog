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
        ...sx, // sx can override any of the above for full flexibility
      }}
      onClick={onClick}
      {...rest}
    >
      {children || label}
    </Button>
  );
};

export default ButtonComp;
