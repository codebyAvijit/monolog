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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import FormFieldComp from "../../components/reusableComps/FormFieldComp";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  updateUser,
  deleteUser,
  setUsers,
} from "../../redux/userSlice";

const validateAllFields = (values) => {
  return validateFields(values, userValidationConfig);
};

const User = () => {
  const dispatch = useDispatch();
  const mainUserArray = useSelector((state) => state.user.users);

  const [open, setOpen] = useState(false);
  // const [role, setRole] = useState("Admin"); // default empty
  const [userFilter, setUserFilter] = useState(""); // default none
  const [roleFilter, setRoleFilter] = useState(""); // default none
  const [errors, setErrors] = useState({});

  //use state for view mode

  const [viewMode, setViewMode] = useState(false);

  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    userName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  //SETING UP STATE FOR IMPLEMENTING EDITING FUNCTIONALITY USING REDUX

  const [editingId, setEditingId] = useState("");

  const resetForm = () => ({
    id: crypto.randomUUID(),
    userName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // console.log("Closing modal...");
    setOpen(false); // closes modal
    setErrors({});
    setForm(resetForm()); // reset form fields
    setEditingId(""); // reset edit mode
    setViewMode(false); // reset view mode
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
    // console.log("Saved form before validation:", form);

    // 1. Run validation
    const validationErrors = validateFields(form, userValidationConfig);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 2. If editing → update, else → add new
    if (editingId) {
      // console.log("Updating user with id:", editingId);
      dispatch(updateUser({ id: editingId, ...form }));
    } else {
      // console.log("Adding new user");
      dispatch(addUser(form));
    }

    // 3. Reset editingId BEFORE closing
    setEditingId("");

    // 4. Close modal (reset form, clear errors, hide dialog)
    handleClose();

    // console.log("Saved successfully & modal closed");
  };

  //EDITING

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  //REPLACINF DELETE LOGIC WITH REDUX

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  const columns = [
    // { key: "id", label: "User ID" },
    { key: "userName", label: "User" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone No." },
    { key: "role", label: "Role" },
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
      <div className="flex flex-wrap gap-4 justify-between w-full">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-[334px]">
            <SelectMenuComp
              label="User"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              options={[
                { value: "Admin", label: "Admin" },
                { value: "User", label: "User" },
              ]}
            />
          </div>
          <div className="w-full sm:w-[334px]">
            <SelectMenuComp
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: "Admin", label: "Admin" },
                { value: "User", label: "User" },
              ]}
            />
          </div>
          <div className="w-full sm:w-[334px]">
            <SearchBarComp />
          </div>
        </div>

        {/* Reusable ButtonComp */}
        <ButtonComp
          variant="contained"
          sx={{
            // maxWidth: "154px",
            height: "60px",
            fontSize: "16px",
            width: { xs: "334px", md: "154px" },
          }}
          onClick={handleOpen} // parent decides what happens
          className="w-full sm:w-auto pt-5 md:mt-5 md:pt-0 ml-0"
        >
          Add New User
        </ButtonComp>
      </div>
      <div className="overflow-x-auto shadow rounded-lg mt-5">
        <TableDataComp
          columns={columns}
          data={mainUserArray}
          actions={actions}
        />
      </div>
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
              maxHeight: "none",
            },
          },
        }}
      >
        <DialogTitle className="flex flex-row  justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]">
          {viewMode ? "View User" : editingId ? "Edit User" : "Add New User"}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Grid layout for form */}
          <div className="grid grid-cols-1 p-2 md:grid-cols-3 gap-x-8 gap-y-6">
            <FormFieldComp
              label="User Name"
              name="userName"
              fullWidth
              value={form.userName}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.userName}
              helperText={errors.userName || ""}
            />
            <FormFieldComp
              label="Phone Number"
              name="phoneNumber"
              fullWidth
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber || ""}
            />
            <FormFieldComp
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              disabled={viewMode}
              error={!!errors.email}
              helperText={errors.email || ""}
            />

            {/*  Role inside grid with margin top */}
            <div className="md:col-span-3 mt-6">
              <SelectMenuComp
                label="Role"
                name="role"
                fullWidth
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

export default User;
