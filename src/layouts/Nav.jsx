// src/layouts/Nav.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import LogoComp from "./LogoComp";
import NoticationsPopUp from "./NoticationsPopUp";
import bellIcon from "../assets/icons/bell.svg";
import { logout } from "../redux/authSlice";

const NAV_HEIGHT = 64; // 64px = h-16 (just for reference)

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNotificationIconClicked, setIsNotificationIconClicked] =
    useState(false);
  const [notificationsCleared, setNotificationsCleared] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [notificationsArray, setNotificationsArray] = useState([
    {
      messageTitle: "New message from Yin",
      messageContent:
        "Hello there! Check out these new items you might be interested in.",
      timeLapse: "10 minutes ago",
      isRead: false,
    },
    {
      messageTitle: "Weekly Pickup Update",
      messageContent: "Your weekly report for Store 3 is ready.",
      timeLapse: "30 minutes ago",
      isRead: false,
    },
    {
      messageTitle: "Payment Confirmed",
      messageContent: "Payment received for your last pickup batch.",
      timeLapse: "1 hour ago",
      isRead: true,
    },
  ]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm lg:text-base transition-colors duration-200 ${
      isActive
        ? "bg-[#012622] text-white"
        : "text-gray-800 hover:bg-[#012622] hover:text-white"
    }`;

  // close popups on outside click + detect mobile
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

    const mq = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setIsMobile(mq.matches);
    handleResize();
    mq.addEventListener("change", handleResize);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      mq.removeEventListener("change", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="
        fixed top-0 left-0 w-full
        bg-white/95 backdrop-blur
        shadow-md
        px-4 md:px-8
        h-16
        flex items-center justify-between
        z-[1000]
      "
    >
      {/* Left: Logo */}
      <div className="flex items-center">
        <LogoComp variant="nav" />
      </div>

      {/* Center: main nav (desktop) */}
      <ul className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-10 font-medium">
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

      {/* Right: notifications + profile + burger */}
      <div className="flex items-center gap-3 sm:gap-5 relative">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setIsNotificationIconClicked((p) => !p);
              if (!isNotificationIconClicked) setNotificationsCleared(true);
            }}
            className="relative cursor-pointer focus:outline-none p-1"
          >
            <img src={bellIcon} alt="Notifications" className="w-6 h-6" />
            {!isNotificationIconClicked && !notificationsCleared && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationsArray.length}
              </span>
            )}
          </button>

          {/* dropdown (desktop) */}
          {isNotificationIconClicked && (
            <div className="absolute right-0 top-9 z-[3000] animate-fadeSlide">
              <NoticationsPopUp
                notificationsArray={notificationsArray}
                setNotificationsArray={setNotificationsArray}
                onClose={() => setIsNotificationIconClicked(false)}
                isMobileDialog={isMobile}
              />
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileClicked((p) => !p)}
            className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-[#012622] text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#012622]"
          >
            R
          </button>

          {isProfileClicked && (
            <div className="absolute right-0 mt-3 w-[220px] bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-[3100] animate-fadeSlide">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#012622] text-white text-sm">
                  R
                </span>
                <p className="text-sm font-medium text-gray-800">John Smith</p>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#012622]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-gray-600">
                  Last Login: 2/26/2025 2:17 AM
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[#E63946] hover:text-red-700 transition-colors w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
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

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen((p) => !p)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor">
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

      {/* Mobile menu (drops under navbar) */}
      {isMobileMenuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white shadow-lg py-3 md:hidden z-[2000] border-t border-gray-200 animate-fadeSlide">
          {["dashboard", "pickups", "store", "setting"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item}`}
                className={navLinkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Nav;
