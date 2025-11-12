import { useState } from "react";
import { Box, Tabs, Tab, useMediaQuery } from "@mui/material";

export default function TabNavigation({ tabs, activeTab, setActiveTab }) {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        width: "fit-content",
        bgcolor: "transparent",
        borderRadius: "22px",
        mx: "auto",
        marginLeft: 0,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="standard"
        TabIndicatorProps={{ style: { display: "none" } }} // Remove indicator
        sx={{
          background: "#025048", // entire pill
          borderRadius: "22px",
          minHeight: "40px",
          boxShadow: "none",
          p: "0px",
          ".MuiTabs-flexContainer": {
            gap: 0,
          },
          ".MuiTab-root": {
            textTransform: "none",
            fontSize: isMobile ? 14 : 17,
            fontWeight: 100,
            color: "#fff",
            minWidth: 80,
            minHeight: "40px",
            px: 4,
            py: 0,
            borderRadius: "22px",
            transition: "background 0.2s",
            zIndex: 1,
            "&.Mui-selected": {
              background: "#012622", // active tab color
              color: "#fff",
              fontWeight: 100,
              zIndex: 2,
            },
            "&:not(:first-of-type)": {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
            "&:not(:last-of-type)": {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab} label={tab} value={tab} disableRipple />
        ))}
      </Tabs>
    </Box>
  );
}
