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
  Alert,
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
import DeleteConfirmationPrompt from "../../components/reusableComps/DeleteConfirmationPrompt";

const validateAllFields = (values) => {
  return validateFields(values, driverValidationConfig);
};

const Driver = () => {
  const dispatch = useDispatch();
  const { drivers, loading, error } = useSelector((state) => state.driver);
  const [open, setOpen] = useState(false);
  const [filterPostcode, setFilterPostcode] = useState("");
  const [filterVehicleType, setFilterVehicleType] = useState("");
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState("");
  const [viewMode, setViewMode] = useState(false);

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    driverId: null,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchDriversData());
  }, [dispatch]);

  // Single form state for adding driver
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
    licenseExpiryDate: null,
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
    licenseExpiryDate: null,
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setForm(resetForm());
    setEditingId("");
    setViewMode(false);
  };

  const handleSnackbarClose = () =>
    setSnackbar({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    const fieldError =
      validateAllFields({ ...form, [name]: value })[name] || "";
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

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
          severity: "success",
        });
      } else {
        await dispatch(createDriver(form)).unwrap();
        setSnackbar({
          open: true,
          message: "Driver created successfully",
          severity: "success",
        });
      }

      await dispatch(fetchDriversData()).unwrap();
      handleClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error: ${err.message || "Operation failed"}`,
        severity: "error",
      });
    }
  };

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, driverId: id });
  };

  // Close delete confirmation dialog
  const handleDeleteClose = () => {
    setDeleteDialog({ open: false, driverId: null });
  };

  // Confirm delete action
  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteDriver(deleteDialog.driverId)).unwrap();
      setSnackbar({
        open: true,
        message: "Driver deleted successfully",
        severity: "info",
      });
      await dispatch(fetchDriversData()).unwrap();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error: ${err.message || "Deletion failed"}`,
        severity: "error",
      });
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
      onClick: (row) => {
        setForm(row);
        setViewMode(true);
        setOpen(true);
      },
    },
    {
      icon: editIcon,
      label: "Edit",
      onClick: (row) => handleEdit(row),
    },
    {
      icon: deleteIcon,
      label: "Delete",
      color: "text-red-600 hover:text-red-800",
      onClick: (row) => handleDeleteClick(row.id),
    },
  ];

  const filteredDrivers = drivers.filter((d) =>
    filterVehicleType ? d.vehicleType === filterVehicleType : true
  );

  return (
    <>
      {loading && (
        <div className="text-center p-4 text-sm md:text-base">Loading...</div>
      )}
      {error && (
        <div className="text-center p-4 text-red-600 text-sm md:text-base">
          Error: {error}
        </div>
      )}

      {/* Filters Section */}
      <div
        className="w-full mx-auto container-3xl"
        style={{ padding: "clamp(16px, 2vw, 25px)" }}
      >
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="w-full sm:w-auto flex flex-wrap gap-4">
            <div className="w-full sm:w-[283px]">
              <SelectMenuComp
                label="Vehicle Type"
                name="filterVehicleType"
                value={filterVehicleType}
                onChange={(e) => setFilterVehicleType(e.target.value)}
                options={[
                  { value: "", label: "All" },
                  { value: "truck", label: "Truck" },
                  { value: "van", label: "Van" },
                  { value: "lorry", label: "Lorry" },
                ]}
              />
            </div>

            <div className="w-full sm:w-[283px]">
              <SearchBarComp />
            </div>
          </div>

          <div className="w-full sm:w-[194px]">
            <ButtonComp
              variant="contained"
              sx={{
                width: "100%",
                height: "60px",
              }}
              onClick={handleOpen}
            >
              Add New Driver
            </ButtonComp>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg mx-auto container-3xl"
        style={{
          marginTop: "clamp(20px, 2vh, 32px)",
          padding: "0 clamp(16px, 2vw, 25px)",
        }}
      >
        <TableDataComp
          columns={columns}
          data={filteredDrivers}
          actions={actions}
        />
      </div>

      {/* Dialog - Updated to Match Figma */}
      <Dialog
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        fullWidth
        maxWidth="xl"
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "calc(100% - 32px)",
                sm: "90%",
                md: "85%",
                lg: "clamp(900px, 80vw, 1280px)",
              },
              margin: {
                xs: "16px",
                sm: "32px auto",
                md: "40px auto",
              },
              borderRadius: {
                xs: "16px",
                sm: "20px",
                md: "22px",
              },
              padding: {
                xs: "16px",
                sm: "20px",
                md: "24px",
              },
              height: "auto",
              minHeight: {
                xs: "300px",
                sm: "350px",
              },
              maxHeight: {
                xs: "calc(100vh - 32px)",
                sm: "90vh",
                md: "85vh",
              },
              overflow: "hidden",
            },
          },
        }}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle
          sx={{
            fontWeight: "800",
            fontSize: {
              xs: "18px",
              sm: "20px",
              md: "22px",
              lg: "24px",
            },
            color: "#012622",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: {
              xs: "16px 16px 12px 16px",
              sm: "20px 20px 16px 20px",
              md: "24px 24px 16px 24px",
            },
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
              width: {
                xs: "36px",
                sm: "40px",
                md: "44px",
              },
              height: {
                xs: "36px",
                sm: "40px",
                md: "44px",
              },
              padding: 0,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon
              sx={{
                fontSize: {
                  xs: "20px",
                  sm: "22px",
                  md: "24px",
                },
              }}
            />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            padding: {
              xs: "16px",
              sm: "20px",
              md: "24px 32px",
            },
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/*  Updated Grid Layout Matching Figma Design */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              width: "100%",
              marginTop: "5px",
            }}
          >
            {/*  Row 1: Driver Name | Phone Number | Email */}
            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                placeholder="Driver Name"
                label="Driver Name"
                name="driverName"
                value={form.driverName}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.driverName}
                helperText={errors.driverName || ""}
                width="100%"
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                placeholder="Phone Number"
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber || ""}
                width="100%"
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                placeholder="Email"
                name="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.email}
                helperText={errors.email || ""}
                width="100%"
              />
            </div>

            {/*  Row 2: License Number | License Expiry Date | Postcodes Covered */}
            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                placeholder="License Number"
                label="License Number"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.licenseNumber}
                helperText={errors.licenseNumber || ""}
                width="100%"
              />
            </div>

            <div style={{ minWidth: 0 }}>
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
            </div>

            <div style={{ minWidth: 0 }}>
              <SelectMenuComp
                label="Postcodes Covered"
                name="postCodesCovered"
                value={form.postCodesCovered}
                onChange={handleChange}
                options={[
                  { value: "SW1", label: "SW1" },
                  { value: "SW2", label: "SW2" },
                  { value: "SW3", label: "SW3" },
                ]}
                disabled={viewMode}
                error={!!errors.postCodesCovered}
                helperText={errors.postCodesCovered || ""}
              />
            </div>

            {/*  Row 3: Address (Full Width) */}
            <div style={{ minWidth: 0, gridColumn: "1 / -1" }}>
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

            {/*  Row 4: Vehicle Type | Vehicle Number | Minimum Tyres Requirement */}
            <div style={{ minWidth: 0 }}>
              <SelectMenuComp
                placeholder="Vehicle Type"
                label="Vehicle Type"
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                options={[
                  { value: "truck", label: "Truck" },
                  { value: "van", label: "Van" },
                  { value: "lorry", label: "Lorry" },
                ]}
                disabled={viewMode}
                error={!!errors.vehicleType}
                helperText={errors.vehicleType || ""}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                placeholder="Vehicle Number"
                name="vehicleNumber"
                label="Vehicle Number"
                value={form.vehicleNumber}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.vehicleNumber}
                helperText={errors.vehicleNumber || ""}
                width="100%"
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                placeholder="Minimum Tyres Requirement"
                label="Minimum Tyres Requirement"
                name="minTyresRequirement"
                value={form.minTyresRequirement}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.minTyresRequirement}
                helperText={errors.minTyresRequirement || ""}
                width="100%"
              />
            </div>

            {/*  Row 5: Maximum Tyres Capacity | Maximum Weight (2 columns only) */}
            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                placeholder="Maximum Tyres Capacity"
                label="Maximum Tyres Capacity"
                name="maxTyresCapacity"
                value={form.maxTyresCapacity}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.maxTyresCapacity}
                helperText={errors.maxTyresCapacity || ""}
                width="100%"
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                placeholder="Maximum Weight (Kg)"
                label="Maximum Weight (Kg)"
                name="maxWeight"
                value={form.maxWeight}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.maxWeight}
                helperText={errors.maxWeight || ""}
                width="100%"
              />
            </div>

            {/*  Empty third column for proper grid alignment */}
            <div style={{ minWidth: 0 }}></div>
          </div>
        </DialogContent>

        {!viewMode && (
          <DialogActions
            sx={{
              justifyContent: "center",
              gap: "12px",
              paddingBottom: {
                xs: "16px",
                sm: "20px",
                md: "24px",
              },
              paddingX: {
                xs: "16px",
                sm: "20px",
                md: "24px",
              },
              flexWrap: "wrap",
            }}
          >
            <ButtonComp
              variant="contained"
              sx={{
                width: {
                  xs: "100%",
                  sm: "140px",
                },
                height: "52px",
                minWidth: "120px",
              }}
              onClick={handleSave}
            >
              Save
            </ButtonComp>
            <ButtonComp
              variant="outlined"
              sx={{
                width: {
                  xs: "100%",
                  sm: "140px",
                },
                height: "52px",
                minWidth: "120px",
                marginLeft: "0 !important",
              }}
              onClick={handleClose}
            >
              Cancel
            </ButtonComp>
          </DialogActions>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationPrompt
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? All of their data will be permanently removed. This action cannot be undone."
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontSize: "clamp(13px, 0.9vw, 15px)",
            padding: "clamp(8px, 1vh, 12px) clamp(12px, 1.5vw, 16px)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Driver;
