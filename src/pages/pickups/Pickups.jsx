// Import necessary libraries and components
import React, { useState } from "react";
import Nav from "../../layouts/Nav";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import FormFieldComp from "../../components/reusableComps/FormFieldComp";
import CloseIcon from "@mui/icons-material/Close";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import weighMentSlip from "../../assets/images/weighmentSlip.jpg";

const Pickups = () => {
  const location = useLocation();

  // Dialog states
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setViewMode(false);
  };

  const handleEndTrip = () => {
    console.log("Trip Ended");
    // trip completion API logic here if needed
    setOpen(false);
  };

  const tabs = [
    { name: "Pick-Ups", path: "subPickups" },
    { name: "Manage/Schedule Pick-ups", path: "manage" },
    { name: "Driver Tracking", path: "driverTracking" },
    { name: "Pick-Ups History", path: "pickupsHistory" },
  ];

  // Check if we are currently on the driver tracking route
  const isDriverTracking = location.pathname.includes("driverTracking");

  return (
    <>
      <Nav />
      <div className="p-4 md:p-6">
        {/* Tabs and End Trip button row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b mb-6 gap-4">
          {/* Tabs */}
          <div className="flex gap-4 md:gap-8 lg:gap-12 overflow-x-auto pb-2 sm:pb-0">
            {tabs.map((tab, idx) => (
              <NavLink
                key={idx}
                to={tab.path}
                className={({ isActive }) =>
                  `pb-2 text-xs md:text-sm font-semibold whitespace-nowrap ${
                    isActive
                      ? "text-[#E98A15] border-b-2 border-[#E98A15]"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </div>

          {/* Conditionally render the End Trip button */}
          {isDriverTracking && (
            <button
              onClick={handleOpen}
              className="bg-white text-[#FF0000] px-4 py-2 rounded-[6px] border border-gray-200 cursor-pointer text-sm font-semibold whitespace-nowrap w-full sm:w-auto hover:bg-red-50 transition-colors"
            >
              End Trip
            </button>
          )}
        </div>

        {/* Child routes */}
        <Outlet />
      </div>

      {/* End Trip Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              width: { xs: "95%", sm: "90%", md: "85%" },
              maxWidth: "900px",
              margin: { xs: "8px", sm: "16px" },
              maxHeight: { xs: "90vh", sm: "85vh" },
              borderRadius: "12px",
              p: { xs: 2, sm: 3 },
              overflowY: "auto",
            },
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            fontWeight: "600",
            fontSize: { xs: "18px", md: "20px", lg: "24px" },
            color: "#012622",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: { xs: "16px", sm: "20px" },
          }}
        >
          End Trip
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#012622",
              ml: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Form Section */}
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <div className="flex flex-col gap-5">
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              <FormFieldComp label="Number of tyres" />
              <FormFieldComp label="Mileage (Miles)" />
              <FormFieldComp label="Weight (kgs)" />
            </div>

            {/* Weighment Slip Image */}
            <div className="flex justify-center mt-3">
              <img
                src={weighMentSlip}
                alt="Weighment Slip"
                className="max-w-full h-auto rounded-lg shadow-md"
                style={{ maxHeight: "400px" }}
              />
            </div>
          </div>
        </DialogContent>

        {/* Buttons */}
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            flexWrap: "wrap",
          }}
        >
          <ButtonComp
            variant="contained"
            sx={{
              width: { xs: "100%", sm: "120px" },
              height: { xs: "45px", sm: "50px" },
              fontSize: { xs: "14px", sm: "16px" },
              borderRadius: "6px",
            }}
            onClick={handleEndTrip}
          >
            End Trip
          </ButtonComp>
          <ButtonComp
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: "120px" },
              height: { xs: "45px", sm: "50px" },
              fontSize: { xs: "14px", sm: "16px" },
              borderRadius: "6px",
            }}
            onClick={handleClose}
          >
            Cancel
          </ButtonComp>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Pickups;
