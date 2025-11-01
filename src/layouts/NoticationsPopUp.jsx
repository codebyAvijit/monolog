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
    <>
      <div className="relative w-max mx-auto">
        <div
          id="dropdownMenu"
          className="absolute block right-0 shadow-lg bg-white py-4 z-[1000] min-w-full rounded-lg w-[300px] sm:w-[410px] max-h-[500px] overflow-auto mt-2"
        >
          <div className="flex flex-wrap items-center justify-between px-4 mb-4 gap-2">
            <h1 className="font-semibold text-gray-900">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h1>
            <p
              className="text-xs text-[#E98A15] font-medium cursor-pointer hover:text-[#D97706]"
              onClick={markAllAsRead}
            >
              Mark all as read
            </p>
          </div>

          <ul className="divide-y divide-gray-300">
            {notificationsArray.map((singleNoti, index) => {
              return (
                <li
                  key={index}
                  className={`dropdown-item p-4 flex items-start hover:bg-gray-50 cursor-pointer ${
                    !singleNoti.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    markAsRead(index);
                    navigate("/viewallnotications");
                  }}
                >
                  <div className={!singleNoti.isRead ? "" : "ml-5"}>
                    <h3
                      className={`text-sm font-medium ${
                        !singleNoti.isRead
                          ? "text-slate-900 font-semibold"
                          : "text-slate-700"
                      }`}
                    >
                      {singleNoti.messageTitle}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                      {singleNoti.messageContent}
                    </p>
                    <p className="text-xs text-[#012622] font-medium leading-3 mt-2">
                      {singleNoti.timeLapse}
                    </p>
                  </div>
                  {/* Orange Dot for Unread */}
                  {!singleNoti.isRead && (
                    <div className="w-2 h-2 bg-[#E98A15] rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between px-4 mb-2 mt-2">
            <p
              className="text-[14px] text-[#E98A15] font-medium cursor-pointer hover:text-[#D97706]"
              onClick={() => {
                setNotificationsArray([]);
              }}
            >
              Clear all
            </p>
            <button
              className="text-[14px] px-4 py-2 bg-[#E98A15] rounded-[2px] text-[#fff] cursor-pointer hover:bg-[#D97706]"
              onClick={handleViewAllNotifications}
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticationsPopUp;
