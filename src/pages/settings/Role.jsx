// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import deleteIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import eyeOpen from "../../assets/icons/eyeOpen.svg";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import SearchBarComp from "../../components/reusableComps/SearchBarComp";
import TableDataComp from "../../components/reusableComps/TableDataComp";
import { fetchRoles, deleteRole } from "../../redux/roleSlice";

const Role = () => {
  const dispatch = useDispatch();
  const { roles, loading, error, pagination } = useSelector(
    (state) => state.role
  );

  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleFilter, setRoleFilter] = useState(""); // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch roles on component mount
  useEffect(() => {
    dispatch(fetchRoles({ page: 1, page_size: 10 }));
  }, [dispatch]);

  const columns = [
    { key: "roleId", label: "Role ID" },
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

  const actions = [
    {
      icon: eyeOpen,
      label: "View",
      onClick: (row) => console.log("View", row),
    },
    // Uncomment when implementing edit/delete
    // {
    //   icon: editIcon,
    //   label: "Edit",
    //   onClick: (row) => console.log("Edit", row),
    // },
    // {
    //   icon: deleteIcon,
    //   label: "Delete",
    //   color: "text-red-600 hover:text-red-800",
    //   onClick: (row) => {
    //     if (window.confirm(`Delete role: ${row.role}?`)) {
    //       dispatch(deleteRole(row.id));
    //     }
    //   },
    // },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-5 justify-between items-end w-full">
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-[334px]">
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
          <div className="w-full sm:w-[334px]">
            <SearchBarComp
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded-lg mt-5">
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
    </>
  );
};

export default Role;
