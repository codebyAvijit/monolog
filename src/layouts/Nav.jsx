// Import necessary libraries and components
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import LogoComp from "./LogoComp";
import NoticationsPopUp from "./NoticationsPopUp";
import bellIcon from "../assets/icons/bell.svg";
import { logout } from "../redux/authSlice";

const Nav = () => {
  const dispatch = useDispatch();
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [notificationsArray, setNotificationsArray] = useState([
    {
      messageTitle: "Your have a new message from Yin",
      messageContent:
        "Hello there, check this new items in from the your may interested from the motion school.",
      timeLapse: "10 minutes ago",
      isRead: false,
    },
    {
      messageTitle: "Your have a new message from Yin",
      messageContent:
        "Hello there, check this new items in from the your may interested from the motion school.",
      timeLapse: "10 minutes ago",
      isRead: false,
    },
    {
      messageTitle: "Your have a new message from Yin",
      messageContent:
        "Hello there, check this new items in from the your may interested from the motion school.",
      timeLapse: "10 minutes ago",
      isRead: true,
    },
    {
      messageTitle: "Your have a new message from Yin",
      messageContent:
        "Hello there, check this new items in from the your may interested from the motion school.",
      timeLapse: "10 minutes ago",
      isRead: false,
    },
  ]);
  const [isNotificationIconClicked, setIsNotificationIconClicked] =
    useState(false);
  const [notificationsCleared, setNotificationsCleared] = useState(false);

  // Refs for click outside detection
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const handeLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition-colors duration-200
      ${
        isActive
          ? "bg-[#012622] text-white"
          : "text-black hover:bg-[#012622] hover:text-white"
      }`;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationIconClicked(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="relative w-full bg-white shadow-md px-4 py-3 flex items-center justify-between z-50">
      {/* Left: Logo */}
      <div className="flex items-center">
        <LogoComp variant="nav" />
      </div>

      {/* Center: Navigation Links - Hidden on mobile, shown on desktop */}
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
          <NavLink to="/store" className={navLinkClasses}>
            Store
          </NavLink>
        </li>
        <li>
          <NavLink to="/setting" className={navLinkClasses}>
            Settings
          </NavLink>
        </li>
      </ul>

      {/* Right: Notification + User Avatar + Mobile Menu Button */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon with badge */}
        <div className="relative" ref={notificationRef}>
          <button
            className="relative cursor-pointer focus:outline-none p-1"
            onClick={() => {
              setIsNotificationIconClicked(!isNotificationIconClicked);
              if (!isNotificationIconClicked) {
                setNotificationsCleared(true);
              }
            }}
            aria-label="Toggle notifications"
          >
            <img
              src={bellIcon}
              alt="Notifications"
              className="w-6 h-6 pointer-events-none"
            />

            {/* Show badge only if dropdown not opened and not cleared */}
            {!isNotificationIconClicked && !notificationsCleared && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                {notificationsArray.length}
              </span>
            )}
          </button>

          {/* Conditional Pop-up */}
          {isNotificationIconClicked && (
            <NoticationsPopUp
              notificationsArray={notificationsArray}
              setNotificationsArray={setNotificationsArray}
            />
          )}
        </div>

        {/* User Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            className="h-8 w-8 flex items-center justify-center rounded-full bg-[#012622] text-white font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#012622] focus:ring-offset-2"
            onClick={() => setIsProfileClicked(!isProfileClicked)}
            aria-label="Toggle profile menu"
          >
            R
          </button>

          {/* Profile Popup */}
          {isProfileClicked && (
            <div className="absolute right-0 mt-2 w-[220px] bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-[1000]">
              {/* Username */}
              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#012622]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0H4.5z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-800">John Smith</p>
              </div>

              {/* Last Login */}
              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#012622]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-gray-600">
                  Last Login : 2/26/2025 2:17:55 AM
                </p>
              </div>

              {/* Logout */}
              <button
                className="flex items-center gap-2 text-[#E63946] cursor-pointer hover:text-red-600 transition w-full"
                onClick={handeLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3H6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15M18 12h-9m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu - Shown when hamburger is clicked */}
      {isMobileMenuOpen && (
        <ul className="absolute top-full left-0 w-full bg-white shadow-lg py-2 md:hidden z-50 border-t border-gray-200">
          <li>
            <NavLink
              to="/dashboard"
              className={navLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pickups"
              className={navLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pickups
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/store"
              className={navLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Store
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/setting"
              className={navLinkClasses}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Nav;
