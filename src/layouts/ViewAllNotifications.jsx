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

  return (
    <>
      <Nav />
      <div className="flex justify-between items-center p-6 w-full">
        <div className="w-full sm:w-auto">
          <SearchBarComp />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6">
        {detailedNotifications.map((section, index) => (
          <div key={index} className="mb-4">
            {/* Time Period Header */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {section.timeLapse}
            </h2>

            {/* Notifications for this period */}
            <div className="flex flex-col gap-3">
              {section.notifications.map((notification, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-[16px] font-medium text-gray-900 mb-2">
                    {notification.title}
                  </h3>
                  <p className="text-[14px] text-gray-600">
                    {notification.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ViewAllNotifications;
