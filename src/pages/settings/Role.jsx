// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import deleteIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import { fetchRoles, deleteRole } from "../../redux/roleSlice";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TableDataComp from "../../components/reusableComps/TableDataComp";

const Role = () => {
  const dispatch = useDispatch();
  const { roles, loading, error, pagination } = useSelector(
    (state) => state.role
  );

  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpen = (roleData) => {
    setSelectedRole(roleData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRole(null);
  };

  // Fetch roles on component mount
  useEffect(() => {
    dispatch(fetchRoles({ page: 1, page_size: 10 }));
  }, [dispatch]);

  const columns = [
    { key: "role", label: "Role" },
    { key: "description", label: "Description" },
  ];

  // Filter roles based on role filter and search query
  const filteredData = roles.filter((item) => {
    const matchesRole = roleFilter === "" || item.role === roleFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  //  Modules/Permissions columns for modal table
  const columnsForModal = [
    { key: "name", label: "Module" },
    {
      key: "view",
      label: "View",
      render: (value) => (
        <Checkbox
          checked={value}
          disabled
          size="small"
          sx={{
            color: "#d1d5db",
            "&.Mui-checked": {
              color: "#9ca3af",
            },
            "&.Mui-disabled": {
              color: "#9ca3af",
            },
          }}
        />
      ),
    },
    {
      key: "add",
      label: "Add",
      render: (value) => (
        <Checkbox
          checked={value}
          disabled
          size="small"
          sx={{
            color: "#d1d5db",
            "&.Mui-checked": {
              color: "#9ca3af",
            },
            "&.Mui-disabled": {
              color: "#9ca3af",
            },
          }}
        />
      ),
    },
    {
      key: "edit",
      label: "Edit",
      render: (value) => (
        <Checkbox
          checked={value}
          disabled
          size="small"
          sx={{
            color: "#d1d5db",
            "&.Mui-checked": {
              color: "#9ca3af",
            },
            "&.Mui-disabled": {
              color: "#9ca3af",
            },
          }}
        />
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (value) => (
        <Checkbox
          checked={value}
          disabled
          size="small"
          sx={{
            color: "#d1d5db",
            "&.Mui-checked": {
              color: "#9ca3af",
            },
            "&.Mui-disabled": {
              color: "#9ca3af",
            },
          }}
        />
      ),
    },
  ];

  //  Data formatted for table
  const dataForModal = [
    {
      id: 1,
      name: "Pick-ups",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    {
      id: 2,
      name: "Subscription",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    {
      id: 3,
      name: "Customer",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    {
      id: 4,
      name: "Driver",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    {
      id: 5,
      name: "Role & Permission",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    {
      id: 6,
      name: "Reports",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    {
      id: 7,
      name: "Settings",
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
  ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => handleOpen(row),
    },
  ];

  return (
    <>
      {/* Header Section */}
      <div
        className="w-full mx-auto container-3xl"
        style={{ padding: "clamp(16px, 2vw, 32px)" }}
      >
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="w-full sm:w-auto flex flex-wrap gap-4">
            {/* Role Select */}
            <div className="w-full sm:w-[283px]">
              <SelectMenuComp
                label="Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { value: "", label: "All" },
                  { value: "Administrator", label: "Administrator" },
                  { value: "Customer", label: "Customer" },
                  { value: "Driver", label: "Driver" },
                ]}
              />
            </div>

            {/* Search Bar */}
            <div className="w-full sm:w-[283px]">
              <SearchBarComp
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div
        className="overflow-x-auto rounded-lg mx-auto container-3xl"
        style={{
          marginTop: "clamp(20px, 2vh, 32px)",
          padding: "0 clamp(16px, 2vw, 32px)",
        }}
      >
        {loading ? (
          <div className="text-center py-8">Loading roles...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">Error: {error}</div>
        ) : (
          <TableDataComp
            columns={columns}
            data={filteredData}
            actions={actions}
          />
        )}
      </div>

      {/*  Modal */}
      <Dialog
        open={open}
        disableRestoreFocus
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "calc(100% - 32px)",
                sm: "95%",
                md: "clamp(800px, 65vw, 950px)",
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
                xs: "20px",
                sm: "24px",
                md: "32px",
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
      >
        <DialogTitle
          sx={{
            fontWeight: "800",
            fontSize: {
              xs: "20px",
              sm: "22px",
              md: "24px",
            },
            color: "#012622",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 0 20px 0",
            margin: 0,
          }}
        >
          Add New Role
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#012622",
              width: { xs: "36px", sm: "40px" },
              height: { xs: "36px", sm: "40px" },
              padding: 0,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: "20px", sm: "22px" } }} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            padding: 0,
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "3px",
            },
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Role Name Field */}
            <TextField
              label="Role Name"
              value={selectedRole?.role || "Administrator"}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                  "& fieldset": {
                    borderColor: "#e5e7eb",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "13px",
                  fontFamily: "ProximaNova, sans-serif",
                  color: "#6b7280",
                },
                "& .MuiOutlinedInput-input": {
                  fontSize: "14px",
                  fontFamily: "ProximaNova, sans-serif",
                  color: "#012622",
                },
              }}
            />

            {/* Description Field */}
            <TextField
              label="Description"
              value={
                selectedRole?.description ||
                "Lorem ipsum dolor sit amet consectetur. Massa vitae pharetra arcu nisl et."
              }
              fullWidth
              multiline
              rows={3}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                  "& fieldset": {
                    borderColor: "#e5e7eb",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "13px",
                  fontFamily: "ProximaNova, sans-serif",
                  color: "#6b7280",
                },
                "& .MuiOutlinedInput-input": {
                  fontSize: "14px",
                  fontFamily: "ProximaNova, sans-serif",
                  color: "#012622",
                },
              }}
            />

            {/*  Permissions Table using TableDataComp */}
            <div style={{ marginTop: "4px" }}>
              <TableDataComp
                columns={columnsForModal}
                data={dataForModal}
                showRightBorder={false}
                bottomBorderColor="border-gray-100"
              />
            </div>

            {/* Close Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "12px",
              }}
            >
              <button
                onClick={handleClose}
                style={{
                  width: "140px",
                  height: "48px",
                  backgroundColor: "transparent",
                  border: "1px solid #012622",
                  borderRadius: "8px",
                  color: "#012622",
                  fontSize: "14px",
                  fontWeight: "500",
                  fontFamily: "ProximaNova, sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(1, 38, 34, 0.04)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Role;
