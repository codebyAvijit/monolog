import React, { useState } from "react";
import SelectMenuComp from "./reusableComps/SelectMenuComp";
import SearchBarComp from "./reusableComps/SearchBarComp";
import ButtonComp from "./reusableComps/ButtonComp";
import TableDataComp from "./reusableComps/TableDataComp";
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit.svg";
import eyeOpen from "../assets/icons/eyeOpen.svg";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import FormFieldComp from "./reusableComps/FormFieldComp";

const User = () => {
  const [open, setOpen] = useState(false);
  // const [role, setRole] = useState("Admin"); // default empty
  const [userFilter, setUserFilter] = useState(""); // default none
  const [roleFilter, setRoleFilter] = useState(""); // default none

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [form, setForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const handleSave = () => {
    console.log("Saved:", form);
    // reset after save
    setForm({
      userName: "",
      phoneNumber: "",
      email: "",
      role: "",
    });
    handleClose();
  };

  const columns = [
    { key: "userId", label: "User ID" },
    { key: "user", label: "User" },
    { key: "email", label: "Email" },
    { key: "phoneNum", label: "Phone No." },
    { key: "role", label: "Role" },
  ];

  const data = [
    {
      userId: "101",
      user: "Noirn Smith",
      email: "admin@company.com",
      phoneNum: "+44 7712 345678",
      role: "Administrator",
    },
    {
      userId: "101",
      user: "Noirn Smith",
      email: "admin@company.com",
      phoneNum: "+44 7712 345678",
      role: "Administrator",
    },
    {
      userId: "101",
      user: "Noirn Smith",
      email: "admin@company.com",
      phoneNum: "+44 7712 345678",
      role: "Administrator",
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
      <div className="flex flex-row flex-wrap justify-between mb-4">
        <div className="flex flex-wrap gap-6 w-full flex-1 min-w-[250px]">
          <SelectMenuComp
            label="User"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            options={[
              { value: "Admin", label: "Admin" },
              { value: "User", label: "User" },
            ]}
          />
          <SelectMenuComp
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: "Admin", label: "Admin" },
              { value: "User", label: "User" },
            ]}
          />
          <SearchBarComp />
        </div>

        {/* Reusable ButtonComp */}
        <ButtonComp
          variant="contained"
          sx={{
            maxWidth: "154px",
            height: "60px",
            fontSize: "16px",
          }}
          onClick={handleOpen} // 👈 parent decides what happens
          className="w-full sm:w-auto"
        >
          Add New User
        </ButtonComp>
      </div>
      <div className="overflow-x-auto shadow rounded-lg">
        <TableDataComp columns={columns} data={data} actions={actions} />
      </div>
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
        <DialogTitle className="flex flex-row justify-between items-center font-[800] text-[20px] md:text-[24px] text-[#012622]">
          Add New User
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Grid layout for form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <FormFieldComp
              label="User Name"
              name="userName"
              fullWidth
              value={form.userName}
              onChange={handleChange}
            />
            <FormFieldComp
              label="Phone Number"
              name="phoneNumber"
              fullWidth
              value={form.phoneNumber}
              onChange={handleChange}
            />
            <FormFieldComp
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />

            {/* ✅ Role inside grid with margin top */}
            <div className="md:col-span-3 mt-6">
              <SelectMenuComp
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "User", label: "User" },
                ]}
              />
            </div>
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

export default User;
