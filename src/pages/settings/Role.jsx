// Import necessary libraries and components
import React, { useState } from "react";
// import ButtonComp from "./reusableComps/ButtonComp";
import deleteIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";

const Role = () => {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [role, setRole] = useState(""); // use role instead of status

  const columns = [
    { key: "roleId", label: "Role ID" },
    { key: "role", label: "Role" },
    { key: "description", label: "Description" },
  ];

  const data = [
    {
      roleId: "101",
      role: "Administrator",
      description:
        "Lorem ipsum dolor sit amet consectetur. Massa vitae pharetra arcu nisl et.",
    },
    {
      roleId: "102",
      role: "Manager",
      description:
        "Lorem ipsum dolor sit amet consectetur. Massa vitae pharetra arcu nisl et.",
    },
    {
      roleId: "103",
      role: "Supervisor",
      description:
        "Lorem ipsum dolor sit amet consectetur. Massa vitae pharetra arcu nisl et.",
    },
  ];

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => console.log("View", row),
    },
    // {
    //   icon: editIcon,
    //   label: "Edit",
    //   onClick: (row) => console.log("Edit", row),
    // },
    // {
    //   icon: deleteIcon,
    //   label: "Delete",
    //   color: "text-red-600 hover:text-red-800",
    //   onClick: (row) => console.log("Delete", row),
    // },
  ];

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <div className="flex gap-6 w-full">
          <SelectMenuComp
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "All", label: "All" },
              { value: "Administrator", label: "Administrator" },
              { value: "Manager", label: "Manager" },
              { value: "Supervisor", label: "Supervisor" },
            ]}
          />

          <SearchBarComp />
        </div>
        {/* <ButtonComp
          variant="contained"
          sx={{
            maxWidth: "154px",
            height: "60px",
            fontSize: "16px",
          }}
          onClick={handleOpen} // 👈 parent decides what happens
        >
          Add Role
        </ButtonComp> */}
      </div>
      <div className="overflow-x-auto shadow rounded-lg">
        <TableDataComp columns={columns} data={data} actions={actions}>
          {isAdmin ? eyeOpen : ""}
        </TableDataComp>
      </div>
    </>
  );
};

export default Role;
