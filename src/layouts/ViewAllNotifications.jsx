import React, { useState } from "react";
import Nav from "./Nav";
import SearchBarComp from "../components/reusableComps/SearchBarComp";

const ViewAllNotifications = () => {
  const [detailedNotifications, setDetailedNotifications] = useState([
    {
      timeLapse: "Today",
      notifications: [
        {
          title: "Lorem ipsum dolor sit amet consectetur.",
          content:
            "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
        },
        {
          title: "New pickup request assigned.",
          content: "You have been assigned a new pickup request for Store 5.",
        },
      ],
    },
    {
      timeLapse: "Yesterday",
      notifications: [
        {
          title: "Lorem ipsum dolor sit amet consectetur.",
          content:
            "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
        },
      ],
    },
    {
      timeLapse: "This Week",
      notifications: [
        {
          title: "Lorem ipsum dolor sit amet consectetur.",
          content:
            "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
        },
      ],
    },
    {
      timeLapse: "This Month",
      notifications: [
        {
          title: "Lorem ipsum dolor sit amet consectetur.",
          content:
            "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
        },
        {
          title: "Lorem ipsum dolor sit amet consectetur.",
          content:
            "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur.",
        },
      ],
    },
  ]);

  // Clear all notifications
  const clearAllNotifications = () => {
    setDetailedNotifications([]);
  };

  // Remove a specific notification
  const removeNotification = (sectionIndex, notificationIndex) => {
    const updatedNotifications = [...detailedNotifications];
    updatedNotifications[sectionIndex].notifications.splice(
      notificationIndex,
      1
    );

    // Remove section if it has no notifications left
    if (updatedNotifications[sectionIndex].notifications.length === 0) {
      updatedNotifications.splice(sectionIndex, 1);
    }

    setDetailedNotifications(updatedNotifications);
  };

  // Count total notifications
  const totalNotifications = detailedNotifications.reduce(
    (total, section) => total + section.notifications.length,
    0
  );

  return (
    <>
      <Nav />

      {/* Header Section with Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 w-full">
        <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
          <SearchBarComp />
        </div>

        {totalNotifications > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-sm text-[#E98A15] font-medium hover:text-[#D97706] transition-colors px-3 py-2 rounded hover:bg-orange-50"
            aria-label="Clear all notifications"
          >
            Clear All ({totalNotifications})
          </button>
        )}
      </div>

      {/* Notifications Content */}
      <div className="px-4 sm:px-6 pb-8">
        {totalNotifications === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Notifications
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              You're all caught up! Check back later for new updates.
            </p>
          </div>
        ) : (
          // Notifications List
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {detailedNotifications.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-2">
                {/* Time Period Header */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                    {section.timeLapse}
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    {section.notifications.length}{" "}
                    {section.notifications.length === 1
                      ? "notification"
                      : "notifications"}
                  </span>
                </div>

                {/* Notifications for this period */}
                <div className="flex flex-col gap-3">
                  {section.notifications.map(
                    (notification, notificationIndex) => (
                      <div
                        key={notificationIndex}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2 leading-snug">
                              {notification.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                              {notification.content}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              removeNotification(
                                sectionIndex,
                                notificationIndex
                              )
                            }
                            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-red-50"
                            aria-label="Remove notification"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewAllNotifications;
