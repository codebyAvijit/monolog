import React from "react";
import { NavLink } from "react-router-dom";
import LogoComp from "./LogoComp";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Nav = () => {
  const navLinkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md transition-colors duration-200
     ${isActive ? "bg-[#012622] text-white" : "text-black hover:bg-[#012622] hover:text-white"}`;

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center">
        <LogoComp variant="nav" />
      </div>

      {/* Center: Navigation Links */}
      <ul className="hidden md:flex space-x-6 font-medium">
        <li>
          <NavLink to="/dashboard" className={navLinkClasses}>
            Dashboard
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/pickups" className={navLinkClasses}>
            Pickups
          </NavLink>
        </li>
        <li>
          <NavLink to="/customer" className={navLinkClasses}>
            Customer
          </NavLink>
        </li>
        <li>
          <NavLink to="/setting" className={navLinkClasses}>
            Settings
          </NavLink>
        </li>
      </ul>

      {/* Right: Notification + User Avatar */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon with badge */}
        <div className="relative cursor-pointer">
          <NotificationsIcon className="text-[#012622]" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            2
          </span>
        </div>

        {/* User Avatar */}
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#012622] text-white font-bold cursor-pointer">
          R
        </div>
      </div>
    </nav>
  );
};

export default Nav;
