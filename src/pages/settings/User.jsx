// Import necessary libraries and components
import React, { useState } from "react";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import deleteIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import CloseIcon from "@mui/icons-material/Close";
import { validateFields } from "../../utils/validation";
import { userValidationConfig } from "../../utils/userValidationConfig";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@mui/material";
import FormFieldComp from "../../components/reusableComps/FormFieldComp";
import { useDispatch, useSelector } from "react-redux";
import { addUser, updateUser, deleteUser } from "../../redux/userSlice";
import DeleteConfirmationPrompt from "../../components/reusableComps/DeleteConfirmationPrompt";
import { margin } from "@mui/system";

const validateAllFields = (values) => {
  return validateFields(values, userValidationConfig);
};

const User = () => {
  const dispatch = useDispatch();
  const mainUserArray = useSelector((state) => state.user.users);

  const [open, setOpen] = useState(false);
  const [userFilter, setUserFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [errors, setErrors] = useState({});
  const [viewMode, setViewMode] = useState(false);
  const [editingId, setEditingId] = useState("");

  //  Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
  });

  //  Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    userName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const resetForm = () => ({
    id: crypto.randomUUID(),
    userName: "",
    email: "",
    phoneNumber: "",
    role: "",
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

  const handleSave = () => {
    const validationErrors = validateFields(form, userValidationConfig);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingId) {
      dispatch(updateUser({ id: editingId, ...form }));
      setSnackbar({
        open: true,
        message: "User updated successfully",
        severity: "success",
      });
    } else {
      dispatch(addUser(form));
      setSnackbar({
        open: true,
        message: "User created successfully",
        severity: "success",
      });
    }

    setEditingId("");
    handleClose();
  };

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  //  Open delete confirmation dialog
  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, userId: id });
  };

  //  Close delete confirmation dialog
  const handleDeleteClose = () => {
    setDeleteDialog({ open: false, userId: null });
  };

  //  Confirm delete action
  const handleDeleteConfirm = () => {
    dispatch(deleteUser(deleteDialog.userId));
    setSnackbar({
      open: true,
      message: "User deleted successfully",
      severity: "info",
    });
  };

  const columns = [
    { key: "userName", label: "User" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone No." },
    { key: "role", label: "Role" },
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
      onClick: (row) => handleDeleteClick(row.id), //  Updated to use dialog
    },
  ];

  return (
    <>
      {/*  Filters Section - Matching Driver Pattern */}
      <div
        className="w-full mx-auto container-3xl"
        style={{ padding: "clamp(16px, 2vw, 25px)" }}
      >
        <div className="flex flex-wrap gap-4 items-end justify-between">
          {/* Left group: User + Role + Search Bar */}
          <div className="w-full sm:w-auto flex flex-wrap gap-4">
            {/* User Select */}
            <div className="w-full sm:w-[283px]">
              <SelectMenuComp
                label="User"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                options={[
                  { value: "", label: "All" },
                  { value: "Admin", label: "Admin" },
                  { value: "User", label: "User" },
                ]}
              />
            </div>

            {/* Role Select */}
            <div className="w-full sm:w-[283px]">
              <SelectMenuComp
                label="Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { value: "", label: "All" },
                  { value: "Admin", label: "Admin" },
                  { value: "User", label: "User" },
                ]}
              />
            </div>

            {/* Search Bar */}
            <div className="w-full sm:w-[283px]">
              <SearchBarComp />
            </div>
          </div>

          {/* Right side: Button */}
          <div className="w-full sm:w-[194px]">
            <ButtonComp
              variant="contained"
              sx={{
                width: "100%",
                height: "60px",
              }}
              onClick={handleOpen}
            >
              Add New User
            </ButtonComp>
          </div>
        </div>
      </div>

      {/*  Table - Matching Driver Pattern */}
      <div
        className="overflow-x-auto rounded-lg mx-auto container-3xl"
        style={{
          marginTop: "clamp(20px, 2vh, 32px)",
          padding: "0 clamp(16px, 2vw, 25px)",
        }}
      >
        <TableDataComp
          columns={columns}
          data={mainUserArray}
          actions={actions}
        />
      </div>

      {/*  Dialog - Matching Driver Pattern */}
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
          {viewMode ? "View User" : editingId ? "Edit User" : "Add New User"}
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
          {/*  Grid layout matching Driver pattern */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              width: "100%",
              marginTop: "5px",
            }}
          >
            {/* User Name */}
            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                label="User Name"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.userName}
                helperText={errors.userName || ""}
                width="100%"
              />
            </div>

            {/* Phone Number */}
            <div style={{ minWidth: 0 }}>
              <FormFieldComp
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

            {/* Email */}
            <div style={{ minWidth: 0 }}>
              <FormFieldComp
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={viewMode}
                error={!!errors.email}
                helperText={errors.email || ""}
                width="100%"
              />
            </div>

            {/* Role - Full width on its own row */}
            <div style={{ minWidth: 0, gridColumn: "1 / -1", width: "32%" }}>
              <SelectMenuComp
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "User", label: "User" },
                ]}
                disabled={viewMode}
                error={!!errors.role}
                helperText={errors.role || ""}
              />
            </div>
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

      {/*  Delete Confirmation Dialog */}
      <DeleteConfirmationPrompt
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? All of their data will be permanently removed. This action cannot be undone."
      />

      {/*  Snackbar */}
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

export default User;
