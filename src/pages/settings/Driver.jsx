// Import necessary libraries and components

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateFields } from "../../utils/validation";
import { driverValidationConfig } from "../../utils/driverValidationConfig";
import {
  addDriver,
  deleteDriver,
  updateDriver,
  setDrivers,
} from "../../redux/driverSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";

import deleteIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import FormFieldComp from "../../components/reusableComps/FormFieldComp";
import DatePickerComp from "../../components/reusableComps/DatePickerComp";

// const validateAllFields = (values) => {
//   const regexNum = /^\d+$/; // digits only
//   const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   let errors = {};

//   // Driver Name
//   if (!values.driverName?.trim()) {
//     errors.driverName = "Driver Name is required";
//   }

//   // Phone Number
//   if (!values.phoneNumber) {
//     errors.phoneNumber = "Phone Number is required";
//   } else if (!regexNum.test(values.phoneNumber)) {
//     errors.phoneNumber = "Phone Number should be a valid number";
//   }

//   //Email
//   if (!values.email) {
//     errors.email = "Email is required";
//   } else if (!regexEmail.test(values.email)) {
//     errors.email = "Invalid email address";
//   }

//   // License Number
//   if (!values.licenseNumber?.trim()) {
//     errors.licenseNumber = "License Number is required";
//   }

//   // Address
//   if (!values.address?.trim()) {
//     errors.address = "Address is required";
//   }

//   //vehicle Number

//   if (!values.vehicleNumber?.trim()) {
//     errors.vehicleNumber = "License Number is required";
//   }

//   // min tyre requirement
//   if (!values.minTyresRequirement) {
//     errors.minTyresRequirement = "Minimum Tyres are required";
//   } else if (!regexNum.test(values.minTyresRequirement)) {
//     errors.minTyresRequirement = "Minimum Tyres should be a valid number";
//   }

//   // max capacity
//   if (!values.maxTyresCapacity) {
//     errors.maxTyresCapacity = "Maximum Typre Capacity is required";
//   } else if (!regexNum.test(values.maxTyresCapacity)) {
//     errors.maxTyresCapacity = "Maximum Typre Capacity should be a valid number";
//   }

//   // license expiry Date
//   if (!values.licenseExpiryDate) {
//     errors.licenseExpiryDate = "License Expiry Date is required";
//   }

//   //postcodes

//   if (!values.postCodesCovered?.trim()) {
//     errors.postCodesCovered = "Postcode is required";
//   }

//   //postcodes

//   if (!values.vehicleType?.trim()) {
//     errors.vehicleType = "Vehicle Type is required";
//   }

//   // max weight

//   if (!values.maxWeight) {
//     errors.maxWeight = "Maximum Wieght is required";
//   } else if (!regexNum.test(values.maxWeight)) {
//     errors.maxWeight = "Maximum Wieght should be a valid number";
//   }

//   return errors;
// };

const validateAllFields = (values) => {
  return validateFields(values, driverValidationConfig);
};

const Driver = () => {
  //REPLACING MAIN PLAN ARRAY WITH REDUX INSTEAD OF LOCAL USESTATE

  const dispatch = useDispatch();
  const mainDriverArray = useSelector((state) => state.driver.drivers);

  const [open, setOpen] = useState(false);
  const [filterPostcode, setFilterPostcode] = useState("");
  const [filterVehicleType, setFilterVehicleType] = useState("");
  const [errors, setErrors] = useState({});

  //SETING UP STATE FOR IMPLEMENTING EDITING FUNCTIONALITY USING REDUX

  const [editingId, setEditingId] = useState("");

  //useState to view a particular selected row

  // const [selectedRow, setSelectedRow] = useState(null);  // not in use as of now kept optional

  //use state for view mode

  const [viewMode, setViewMode] = useState(false);

  //single form state for adding driver

  const [form, setForm] = useState({
    id: crypto.randomUUID(),
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

  const resetForm = () => ({
    id: crypto.randomUUID(),
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
  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setForm(resetForm());
    setEditingId("");
    setViewMode(false); // reset back
  };

  //changes cleared as soon as user starts typing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on input

    // Run validation for this field only
    const fieldError =
      validateAllFields({ ...form, [name]: value })[name] || "";
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  //pseudo code
  // 1. Run validation
  // 2. If there are errors, show them and stop
  // 3. If no errors, save data
  // 4. Close modal and reset form

  const handleSave = () => {
    // const validationErrors = validateAllFields(form); // run validation
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors); // show errors
    //   return; // stop saving
    // }

    const validationErrors = validateFields(form, driverValidationConfig);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingId) {
      dispatch(updateDriver({ id: editingId, ...form }));
    } else {
      dispatch(addDriver(form));
    }

    handleClose(); // reset form & close modal
  };

  //EDITING

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  //REPLACINF DELETE LOGIC WITH REDUX

  const handleDelete = (id) => {
    dispatch(deleteDriver(id));
  };

  const columns = [
    { key: "driverName", label: "Driver Name" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "licenseNumber", label: "License Number" },
    { key: "licenseExpiryDate", label: "License Expiry Date" },
    { key: "vehicleType", label: "Vehicle Type" },
    { key: "vehicleNumber", label: "Vehicle Number" },
    { key: "postCodesCovered", label: "Postcodes Covered" },
    { key: "tyresToday", label: "Tyres Today" },
    { key: "tyresCurrentWeek", label: "Tyres Current Week" },
    { key: "tyresCurrentMonth", label: "Tyres Current Month" },
  ];

  //DUMMY DATA

  // const data = [
  //   {
  //     driverName: "John Doe",
  //     phoneNumber: "+44 7712 345678",
  //     email: "johndoe@company.com",
  //     licenseNumber: "LIC123456",
  //     vehicleType: "Truck",
  //     vehicleNumber: "PZ65 ABC",
  //     postCodesCovered: "110001",
  //     tyresToday: "90",
  //     tyresCurrentWeek: "490",
  //     tyresCurrentMonth: "2700",
  //   },
  //   {
  //     driverName: "John Doe",
  //     phoneNumber: "+44 7712 345678",
  //     email: "johndoe@company.com",
  //     licenseNumber: "LIC123456",
  //     vehicleType: "Truck",
  //     vehicleNumber: "PZ65 ABC",
  //     postCodesCovered: "100111",
  //     tyresToday: "90",
  //     tyresCurrentWeek: "490",
  //     tyresCurrentMonth: "2700",
  //   },
  //   {
  //     driverName: "John Doe",
  //     phoneNumber: "+44 7712 345678",
  //     email: "johndoe@company.com",
  //     licenseNumber: "LIC123456",
  //     vehicleType: "Truck",
  //     vehicleNumber: "PZ65 ABC",
  //     postCodesCovered: "200222",
  //     tyresToday: "90",
  //     tyresCurrentWeek: "490",
  //     tyresCurrentMonth: "2700",
  //   },
  // ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      // onClick: (row) => console.log("View", row),
      onClick: (row) => {
        setForm(row); // fill the form with selected row data
        setViewMode(true); // enable view mode
        setOpen(true); // open modal
      },
    },
    {
      icon: editIcon,
      label: "Edit",
      // onClick: (row) => console.log("Edit", row),
      onClick: (row) => handleEdit(row),
    },
    {
      icon: deleteIcon,
      label: "Delete",
      color: "text-red-600 hover:text-red-800",
      // onClick: (row) => console.log("Delete", row),
      // onClick: (row) => handleDelete(row.id),
      onClick: (row) => {
        let confirmation = confirm("Are you sure you want to proceed?");
        if (confirmation) {
          alert("You chose to proceed.");
          handleDelete(row.id);
        } else {
          alert("You cancelled the action.");
        }
      },
    },
  ];

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
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

        <ButtonComp
          variant="contained"
          sx={{
            fontSize: "16px",
            borderRadius: "6px",
            width: { xs: "334px", md: "154px" },
          }}
          onClick={handleOpen}
          className="w-full sm:w-auto pt-5 md:pt-0 ml-0"
        >
          Add New Driver
        </ButtonComp>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <TableDataComp
          columns={columns}
          data={mainDriverArray}
          actions={actions}
        />
      </div>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
        slotProps={{
          paper: {
            sx: {
              maxWidth: "1177px",
              borderRadius: "12px",
              p: 3,
              // maxHeight: "723px",
              // backgroundColor: "red",
              overflowY: "auto",
            },
          },
        }}
      >
        <DialogTitle
          className="flex flex-row justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]"
          sx={{ fontWeight: "600", fontSize: "20px", color: "#012622" }}
        >
          {viewMode
            ? "View Driver"
            : editingId
            ? "Edit Driver"
            : "Add New Driver"}
          <IconButton onClick={handleClose} sx={{ color: "#012622" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Grid layout for form */}
          <div className="flex flex-wrap pt-2 gap-x-7 gap-y-7 justify-center lg:justify-start">
            <FormFieldComp
              placeholder="Driver Name"
              label="Driver Name"
              name="driverName"
              // fullWidth
              value={form.driverName}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.driverName}
              helperText={errors.driverName || ""}
            />
            <FormFieldComp
              placeholder="Phone Number"
              label="Phone Number"
              name="phoneNumber"
              // fullWidth
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber || ""}
            />
            <FormFieldComp
              placeholder="Email"
              name="email"
              label="Email"
              // fullWidth
              value={form.email}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.email}
              helperText={errors.email || ""}
            />
            <FormFieldComp
              placeholder="License Number"
              label="License Number"
              name="licenseNumber"
              // fullWidth
              value={form.licenseNumber}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.licenseNumber}
              helperText={errors.licenseNumber || ""}
            />

            <DatePickerComp
              label="License Expiry Date"
              value={
                form.licenseExpiryDate ? dayjs(form.licenseExpiryDate) : null
              }
              onChange={(newValue) =>
                setForm((prev) => ({
                  ...prev,
                  licenseExpiryDate: newValue
                    ? dayjs(newValue).format("YYYY-MM-DD")
                    : null,
                }))
              }
              placeholder="Select Expiry Date"
              width="334px"
              disabled={viewMode}
              error={!!errors.licenseExpiryDate}
              helperText={errors.licenseExpiryDate || ""}
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
              disabled={viewMode}
              error={!!errors.postCodesCovered}
              helperText={errors.postCodesCovered || ""}
            />

            <div className="w-[334px] xl:w-full lg:max-w-[1060px]">
              <FormFieldComp
                placeholder="Address"
                label="Address"
                name="address"
                // fullWidth
                // width="1077px"
                width="100%"
                value={form.address}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.address}
                helperText={errors.address || ""}
              />
            </div>

            <SelectMenuComp
              placeholder="Vehicle Type"
              label="Vehicle Type"
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              options={[{ value: "Truck", label: "Truck" }]}
              disabled={viewMode}
              error={!!errors.vehicleType}
              helperText={errors.vehicleType || ""}
            />

            <FormFieldComp
              placeholder="Vehicle Number"
              name="vehicleNumber"
              label="Vehicle Number"
              // fullWidth
              value={form.vehicleNumber}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.vehicleNumber}
              helperText={errors.vehicleNumber || ""}
            />
            <FormFieldComp
              placeholder="Minimum Tyres Requirement"
              label="Minimum Tyres Requirement"
              name="minTyresRequirement"
              // fullWidth
              value={form.minTyresRequirement}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.minTyresRequirement}
              helperText={errors.minTyresRequirement || ""}
            />
            <FormFieldComp
              placeholder="Maximum Tyres Capacity"
              label="Maximum Tyres Capacity"
              name="maxTyresCapacity"
              // fullWidth
              value={form.maxTyresCapacity}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.maxTyresCapacity}
              helperText={errors.maxTyresCapacity || ""}
            />
            <FormFieldComp
              placeholder="Maximum Weight (Kg)"
              label="Maximum Weight (Kg)"
              name="maxWeight"
              // fullWidth
              value={form.maxWeight}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.maxWeight}
              helperText={errors.maxWeight || ""}
            />
          </div>
        </DialogContent>
        {!viewMode && (
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
        )}
      </Dialog>
    </>
  );
};

export default Driver;
