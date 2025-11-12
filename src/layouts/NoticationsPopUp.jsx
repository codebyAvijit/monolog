import React from "react";
import { useNavigate } from "react-router-dom";

const NoticationsPopUp = ({
  notificationsArray,
  setNotificationsArray,
  onClose,
  isMobileDialog,
}) => {
  const navigate = useNavigate();

  // Handle navigation to all notifications
  const handleViewAllNotifications = () => {
    navigate("/viewallnotications");
    onClose?.();
  };

  // Mark single notification as read
  const markAsRead = (index) => {
    const updated = [...notificationsArray];
    updated[index].isRead = true;
    setNotificationsArray(updated);
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updated = notificationsArray.map((n) => ({ ...n, isRead: true }));
    setNotificationsArray(updated);
  };

  const unreadCount = notificationsArray.filter((n) => !n.isRead).length;

  const content = (
    <div
      className={`shadow-lg bg-white py-4 z-[3200] rounded-xl
        w-[90vw] sm:w-[380px] md:w-[420px] lg:w-[460px]
        max-h-[80vh] overflow-auto relative border border-gray-100
        animate-fadeSlide
        ${isMobileDialog ? "fixed inset-x-4 top-15 mx-auto mr-10" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h1 className="font-semibold text-gray-900 text-base md:text-lg">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h1>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs md:text-sm text-[#E98A15] font-medium hover:text-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#E98A15] rounded px-1"
            >
              Mark all as read
            </button>
          )}

          {/* Close Button for all screen types */}
          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="text-gray-400 hover:text-gray-700 text-xl md:text-2xl leading-none focus:outline-none focus:ring-1 focus:ring-gray-300 rounded"
          >
            ×
          </button>
        </div>
      </div>

      {/* Notification List */}
      {notificationsArray.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500 text-sm">
          No notifications
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notificationsArray.map((n, i) => (
            <li
              key={i}
              className={`group p-4 flex items-start gap-3 hover:bg-gray-50 transition ${
                !n.isRead ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3
                    className={`text-sm md:text-base ${
                      !n.isRead
                        ? "text-slate-900 font-semibold"
                        : "text-slate-700 font-medium"
                    }`}
                  >
                    {n.messageTitle}
                  </h3>

                  {/* Mark as read button */}
                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(i);
                      }}
                      className="text-xs text-[#E98A15] hover:text-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#E98A15] rounded px-1"
                    >
                      Mark as read
                    </button>
                  )}
                </div>

                <p className="text-xs md:text-sm text-slate-500 mt-1.5 line-clamp-2">
                  {n.messageContent}
                </p>
                <p className="text-xs text-[#012622] font-medium mt-2">
                  {n.timeLapse}
                </p>
              </div>

              {!n.isRead && (
                <div
                  className="w-2 h-2 bg-[#E98A15] rounded-full mt-1"
                  aria-label="Unread notification"
                ></div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      {notificationsArray.length > 0 && (
        <div className="flex justify-between items-center px-4 mt-4">
          <button
            className="text-sm text-[#E98A15] hover:text-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#E98A15] rounded px-2"
            onClick={() => setNotificationsArray([])}
          >
            Clear
          </button>
          <button
            onClick={handleViewAllNotifications}
            className="text-sm px-4 py-2 bg-[#E98A15] rounded-md text-white hover:bg-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#E98A15] focus:ring-offset-1"
          >
            View All
          </button>
        </div>
      )}
    </div>
  );

  // Modal behavior for mobile
  if (isMobileDialog) {
    return (
      <div className="fixed inset-0 bg-black/40 z-[3100] flex items-start justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default NoticationsPopUp;
