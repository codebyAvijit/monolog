// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateFields } from "../../utils/validation";
import { driverValidationConfig } from "../../utils/driverValidationConfig";
import {
  createDriver,
  deleteDriver,
  updateDriver,
  fetchDriversData,
} from "../../redux/driverSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
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

const validateAllFields = (values) => {
  return validateFields(values, driverValidationConfig);
};

const Driver = () => {
  //REPLACING MAIN PLAN ARRAY WITH REDUX INSTEAD OF LOCAL USESTATE
  const dispatch = useDispatch();
  const { drivers, loading, error } = useSelector((state) => state.driver);
  const [open, setOpen] = useState(false);
  const [filterPostcode, setFilterPostcode] = useState("");
  const [filterVehicleType, setFilterVehicleType] = useState("");
  const [errors, setErrors] = useState({});
  //SETING UP STATE FOR IMPLEMENTING EDITING FUNCTIONALITY USING REDUX
  const [editingId, setEditingId] = useState("");
  //useState to view a particular selected row
  // const [selectedRow, setSelectedRow] = useState(null); // not in use as of now kept optional
  //use state for view mode
  const [viewMode, setViewMode] = useState(false);

  //  Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    dispatch(fetchDriversData());
  }, [dispatch]);

  //single form state for adding driver
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

  const resetForm = () => ({
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

  const handleSnackbarClose = () =>
    setSnackbar({ open: false, message: "", type: "" });

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
  //  Save Handler with Snackbar + Real-time Refresh
  const handleSave = async () => {
    const validationErrors = validateFields(form, driverValidationConfig);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (editingId) {
        await dispatch(updateDriver({ id: editingId, ...form })).unwrap();
        setSnackbar({
          open: true,
          message: "Driver updated successfully",
          type: "success",
        });
      } else {
        await dispatch(createDriver(form)).unwrap(); // pass form, thunk will transform it
        setSnackbar({
          open: true,
          message: "Driver created successfully",
          type: "success",
        });
      }

      //  Fetch latest drivers after save
      await dispatch(fetchDriversData()).unwrap();

      handleClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error: ${err.message || "Operation failed"}`,
        type: "error",
      });
    }
  };

  //EDITING
  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  //  Delete Handler with Snackbar + Real-time Refresh
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to proceed?")) {
      try {
        await dispatch(deleteDriver(id)).unwrap();
        setSnackbar({
          open: true,
          message: "Driver deleted successfully",
          type: "success",
        });
        await dispatch(fetchDriversData()).unwrap();
      } catch (err) {
        setSnackbar({
          open: true,
          message: `Error: ${err.message || "Deletion failed"}`,
          type: "error",
        });
      }
    }
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
      onClick: (row) => handleDelete(row.id),
    },
  ];

  const filteredDrivers = drivers.filter((d) =>
    filterVehicleType ? d.vehicleType === filterVehicleType : true
  );

  return (
    <>
      {loading && <div className="text-center p-4">Loading...</div>}
      {error && (
        <div className="text-center p-4 text-red-600">Error: {error}</div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-5 justify-between items-end w-full">
        {/* Left group: Vehicle Type + Search Bar */}
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-[334px]">
            <SelectMenuComp
              label="Vehicle Type"
              name="filterVehicleType"
              value={filterVehicleType}
              onChange={(e) => setFilterVehicleType(e.target.value)}
              options={[
                { value: "", label: "All" },
                { value: "Truck", label: "Truck" },
                { value: "Van", label: "Van" },
                { value: "Lorry", label: "Lorry" },
              ]}
            />
          </div>
          <div className="w-full sm:w-[334px]">
            <SearchBarComp />
          </div>
        </div>

        {/* Right side: Button */}
        <div className="w-full sm:w-auto">
          <ButtonComp
            variant="contained"
            sx={{
              fontSize: "16px",
              borderRadius: "6px",
              width: { xs: "100%", sm: "154px" },
            }}
            onClick={handleOpen}
          >
            Add New Driver
          </ButtonComp>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg mt-5">
        <TableDataComp
          columns={columns}
          data={filteredDrivers}
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
              width: { xs: "95%", sm: "90%", md: "85%", lg: "1177px" },
              margin: { xs: "8px", sm: "16px" },
              maxHeight: { xs: "90vh", sm: "85vh" },
              borderRadius: "12px",
              p: { xs: 2, sm: 3 },
              overflowY: "auto",
            },
          },
        }}
      >
        <DialogTitle
          className="flex flex-row justify-between items-center"
          sx={{
            fontWeight: "600",
            fontSize: { xs: "18px", md: "20px", lg: "24px" },
            color: "#012622",
            p: { xs: "16px", sm: "20px" },
          }}
        >
          {viewMode
            ? "View Driver"
            : editingId
            ? "Edit Driver"
            : "Add New Driver"}
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

        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Grid layout for form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-7 pt-2">
            <FormFieldComp
              placeholder="Driver Name"
              label="Driver Name"
              name="driverName"
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
              width="100%"
              disabled={viewMode}
              error={!!errors.licenseExpiryDate}
              helperText={errors.licenseExpiryDate || ""}
            />

            {/* Empty div for spacing on desktop - keeps 2-column layout */}
            <div className="hidden lg:block"></div>

            {/* Full-width Address field */}
            <div className="sm:col-span-2 lg:col-span-3">
              <FormFieldComp
                placeholder="Address"
                label="Address"
                name="address"
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
              options={[
                { value: "Truck", label: "Truck" },
                { value: "Van", label: "Van" },
                { value: "Lorry", label: "Lorry" },
              ]}
              disabled={viewMode}
              error={!!errors.vehicleType}
              helperText={errors.vehicleType || ""}
            />

            <FormFieldComp
              placeholder="Vehicle Number"
              name="vehicleNumber"
              label="Vehicle Number"
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
              value={form.maxWeight}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.maxWeight}
              helperText={errors.maxWeight || ""}
            />
          </div>
        </DialogContent>

        {!viewMode && (
          <DialogActions
            sx={{
              justifyContent: "center",
              gap: { xs: 2, sm: 3 },
              pb: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <ButtonComp
              variant="contained"
              sx={{
                width: { xs: "100px", sm: "120px" },
                height: { xs: "45px", sm: "50px" },
                fontSize: { xs: "14px", sm: "16px" },
                borderRadius: "6px",
              }}
              onClick={handleSave}
            >
              Save
            </ButtonComp>
            <ButtonComp
              variant="outlined"
              sx={{
                width: { xs: "100px", sm: "120px" },
                height: { xs: "45px", sm: "50px" },
                fontSize: { xs: "14px", sm: "16px" },
                borderRadius: "6px",
              }}
              onClick={handleClose}
            >
              Cancel
            </ButtonComp>
          </DialogActions>
        )}
      </Dialog>

      {/*  Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            backgroundColor:
              snackbar.type === "success" ? "#2E7D32" : "#D32F2F",
            color: "#fff",
            fontWeight: 600,
          },
        }}
      />
    </>
  );
};

export default Driver;
