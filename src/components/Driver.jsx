//driver comp

// src/pages/Driver.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import SelectMenuComp from "./reusableComps/SelectMenuComp";
import SearchBarComp from "./reusableComps/SearchBarComp";
import ButtonComp from "./reusableComps/ButtonComp";
import TableDataComp from "./reusableComps/TableDataComp";
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit.svg";
import eyeOpen from "../assets/icons/eyeOpen.svg";
import FormFieldComp from "./reusableComps/FormFieldComp";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import DatePickerComp from "./reusableComps/DatePickerComp";

const Driver = () => {
  const [open, setOpen] = useState(false);
  const [filterPostcode, setFilterPostcode] = useState("");
  const [filterVehicleType, setFilterVehicleType] = useState("");

  // ✅ single form state
  const [form, setForm] = useState({
    driverName: "",
    phoneNumber: "",
    email: "",
    licenseNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    postCodesCovered: "",
    minTyresRequirement: "",
    maxTyresCapacity: "",
    maxWeight: "",
    address: "",
    tyresToday: "",
    tyresCurrentWeek: "",
    tyresCurrentMonth: "",
    planActivationDate: null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ✅ generic change handler
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    console.log("Saved:", form);
    // reset after save
    setForm({
      driverName: "",
      phoneNumber: "",
      email: "",
      licenseNumber: "",
      vehicleType: "",
      vehicleNumber: "",
      postCodesCovered: "",
      minTyresRequirement: "",
      maxTyresCapacity: "",
      maxWeight: "",
      address: "",
      tyresToday: "",
      tyresCurrentWeek: "",
      tyresCurrentMonth: "",
      planActivationDate: null,
    });
    handleClose();
  };

  const columns = [
    { key: "driverName", label: "Driver Name" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "licenseNumber", label: "License Number" },
    { key: "vehicleType", label: "Vehicle Type" },
    { key: "vehicleNumber", label: "Vehicle Number" },
    { key: "postCodesCovered", label: "Postcodes Covered" },
    { key: "tyresToday", label: "Tyres Today" },
    { key: "tyresCurrentWeek", label: "Tyres Current Week" },
    { key: "tyresCurrentMonth", label: "Tyres Current Month" },
  ];

  const data = [
    {
      driverName: "John Doe",
      phoneNumber: "+44 7712 345678",
      email: "johndoe@company.com",
      licenseNumber: "LIC123456",
      vehicleType: "Truck",
      vehicleNumber: "PZ65 ABC",
      postCodesCovered: "110001",
      tyresToday: "90",
      tyresCurrentWeek: "490",
      tyresCurrentMonth: "2700",
    },
    {
      driverName: "John Doe",
      phoneNumber: "+44 7712 345678",
      email: "johndoe@company.com",
      licenseNumber: "LIC123456",
      vehicleType: "Truck",
      vehicleNumber: "PZ65 ABC",
      postCodesCovered: "100111",
      tyresToday: "90",
      tyresCurrentWeek: "490",
      tyresCurrentMonth: "2700",
    },
    {
      driverName: "John Doe",
      phoneNumber: "+44 7712 345678",
      email: "johndoe@company.com",
      licenseNumber: "LIC123456",
      vehicleType: "Truck",
      vehicleNumber: "PZ65 ABC",
      postCodesCovered: "200222",
      tyresToday: "90",
      tyresCurrentWeek: "490",
      tyresCurrentMonth: "2700",
    },
  ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => console.log("View", row),
    },
    {
      icon: editIcon,
      label: "Edit",
      onClick: (row) => console.log("Edit", row),
    },
    {
      icon: deleteIcon,
      label: "Delete",
      color: "text-red-600 hover:text-red-800",
      onClick: (row) => console.log("Delete", row),
    },
  ];

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between mb-4 gap-4">
        <div className="flex flex-wrap gap-6 flex-1 min-w-[250px]">
          <SelectMenuComp
            label="PostCodes"
            name="filterPostcode"
            value={filterPostcode}
            onChange={(e) => setFilterPostcode(e.target.value)}
            options={[
              { value: "110001", label: "110001" },
              { value: "100111", label: "100111" },
              { value: "200222", label: "200222" },
            ]}
          />

          <SelectMenuComp
            label="Vehicle Type"
            name="filterVehicleType"
            value={filterVehicleType}
            onChange={(e) => setFilterVehicleType(e.target.value)}
            options={[
              { value: "Truck", label: "Truck" },
              { value: "Van", label: "Van" },
              { value: "Bike", label: "Bike" },
            ]}
          />
          <SearchBarComp />
        </div>

        <ButtonComp
          variant="contained"
          sx={{ fontSize: "16px", borderRadius: "6px", width: "154px" }}
          onClick={handleOpen}
          className="w-full sm:w-auto"
        >
          Add New Driver
        </ButtonComp>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <TableDataComp columns={columns} data={data} actions={actions} />
      </div>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              maxWidth: "1177px",
              borderRadius: "12px",
              p: 3,
              maxHeight: "none",
            },
          },
        }}
      >
        <DialogTitle
          className="flex flex-row justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]"
          sx={{ fontWeight: "600", fontSize: "20px", color: "#012622" }}
        >
          Add New Driver
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Grid layout for form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <FormFieldComp
              placeholder="Driver Name"
              name="driverName"
              // fullWidth
              value={form.driverName}
              onChange={handleChange}
            />
            <FormFieldComp
              placeholder="Phone Number"
              name="phoneNumber"
              // fullWidth
              value={form.phoneNumber}
              onChange={handleChange}
            />
            <FormFieldComp
              placeholder="Email"
              name="email"
              // fullWidth
              value={form.email}
              onChange={handleChange}
            />
            <FormFieldComp
              placeholder="License Number"
              name="licenseNumber"
              // fullWidth
              value={form.licenseNumber}
              onChange={handleChange}
            />

            <DatePickerComp
              label="License Expiry Date"
              value={
                form.licenseExpiryDate ? dayjs(form.licenseExpiryDate) : null
              }
              onChange={(newValue) =>
                setForm((prev) => ({ ...prev, licenseExpiryDate: newValue }))
              }
              placeholder="Select Expiry Date"
              width="334px" // Optional: custom width
            />

            <SelectMenuComp
              placeholder="Postcodes Covered"
              name="postCodesCovered"
              label="Postcodes Covered"
              value={form.postCodesCovered}
              onChange={handleChange}
              options={[
                { value: "110001", label: "110001" },
                { value: "100111", label: "100111" },
                { value: "200222", label: "200222" },
              ]}
            />

            <FormFieldComp
              placeholder="Address"
              name="address"
              // fullWidth
              width="1077px"
              className="md:col-span-3"
              value={form.address}
              onChange={handleChange}
            />

            <SelectMenuComp
              placeholder="Vehicle Type"
              label="Vehicle Type"
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              options={[{ value: "Truck", label: "Truck" }]}
            />

            <FormFieldComp
              placeholder="Vehicle Number"
              name="vehicleNumber"
              // fullWidth
              value={form.vehicleNumber}
              onChange={handleChange}
            />
            <FormFieldComp
              placeholder="Minimum Tyres Requirement"
              name="minTyresRequirement"
              // fullWidth
              value={form.minTyresRequirement}
              onChange={handleChange}
            />
            <FormFieldComp
              placeholder="Maximum Tyres Capacity"
              name="maxTyresCapacity"
              // fullWidth
              value={form.maxTyresCapacity}
              onChange={handleChange}
            />
            <FormFieldComp
              placeholder="Maximum Weight (Kg)"
              name="maxWeight"
              // fullWidth
              value={form.maxWeight}
              onChange={handleChange}
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 3, pb: 2 }}>
          <ButtonComp
            variant="contained"
            sx={{
              width: "120px",
              height: "50px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
            onClick={handleSave}
          >
            Save
          </ButtonComp>
          <ButtonComp
            variant="outlined"
            sx={{
              width: "120px",
              height: "50px",
              fontSize: "16px",
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

export default Driver;
