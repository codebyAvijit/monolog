import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NoticationsPopUp = ({ notificationsArray, setNotificationsArray }) => {
  const navigate = useNavigate();

  const handleViewAllNotifications = () => {
    navigate("/viewallnotications");
  };

  // Mark single notification as read
  const markAsRead = (index) => {
    const updatedNotifications = [...notificationsArray];
    updatedNotifications[index].isRead = true;
    setNotificationsArray(updatedNotifications);
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notificationsArray.map((noti) => ({
      ...noti,
      isRead: true,
    }));
    setNotificationsArray(updatedNotifications);
  };

  // Count unread notifications
  const unreadCount = notificationsArray.filter((noti) => !noti.isRead).length;

  return (
    <div className="relative w-full sm:w-max mx-auto">
      <div
        id="dropdownMenu"
        className="absolute right-0 shadow-lg bg-white py-4 z-[1000] rounded-lg w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] max-w-[95vw] max-h-[500px] overflow-auto mt-2"
        role="menu"
        aria-label="Notifications"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between px-4 mb-4 gap-2">
          <h1 className="font-semibold text-gray-900 text-base">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h1>
          {unreadCount > 0 && (
            <button
              className="text-xs sm:text-sm text-[#E98A15] font-medium cursor-pointer hover:text-[#D97706] transition-colors px-2 py-1 rounded hover:bg-orange-50"
              onClick={markAllAsRead}
              aria-label="Mark all notifications as read"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notificationsArray.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-slate-500 text-sm">No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200" role="list">
            {notificationsArray.map((singleNoti, index) => (
              <li
                key={index}
                className={`p-4 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !singleNoti.isRead ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  markAsRead(index);
                  navigate("/viewallnotications");
                }}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    markAsRead(index);
                    navigate("/viewallnotications");
                  }
                }}
              >
                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm leading-snug ${
                      !singleNoti.isRead
                        ? "text-slate-900 font-semibold"
                        : "text-slate-700 font-medium"
                    }`}
                  >
                    {singleNoti.messageTitle}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
                    {singleNoti.messageContent}
                  </p>
                  <p className="text-xs text-[#012622] font-medium mt-2">
                    {singleNoti.timeLapse}
                  </p>
                </div>

                {/* Unread Dot Indicator at the End */}
                <div className="flex-shrink-0 pt-1">
                  {!singleNoti.isRead && (
                    <div
                      className="w-2 h-2 bg-[#E98A15] rounded-full"
                      aria-label="Unread notification"
                    ></div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer Actions */}
        {notificationsArray.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 mt-4 gap-2">
            <button
              className="text-sm text-[#E98A15] font-medium cursor-pointer hover:text-[#D97706] transition-colors px-3 py-2 rounded hover:bg-orange-50 text-center sm:text-left"
              onClick={() => {
                setNotificationsArray([]);
              }}
              aria-label="Clear all notifications"
            >
              Clear all
            </button>
            <button
              className="text-sm px-4 py-2 bg-[#E98A15] rounded hover:bg-[#D97706] text-white cursor-pointer transition-colors font-medium"
              onClick={handleViewAllNotifications}
            >
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticationsPopUp;
