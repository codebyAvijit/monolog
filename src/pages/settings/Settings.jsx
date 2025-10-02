// Import necessary libraries and components
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Nav from "../../layouts/Nav";

const Settings = () => {
  const tabs = [
    { name: "SUBSCRIPTION PLAN", path: "subscription" },
    { name: "DRIVER", path: "driver" },
    { name: "ROLE", path: "role" },
    { name: "USER", path: "user" },
    { name: "POSTCODE", path: "postcode" },
  ];

  return (
    <>
      <Nav />
      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-12 border-b mb-6 overflow-x-auto">
          {tabs.map((tab, idx) => (
            <NavLink
              key={idx}
              to={tab.path}
              className={({ isActive }) =>
                `pb-2 text-sm font-semibold ${
                  isActive
                    ? "text-[#E98A15] border-b-2 border-[#E98A15]"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>

        {/* Render child component */}
        <Outlet />
      </div>
    </>
  );
};

export default Settings;
