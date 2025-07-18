import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import { Bell, Settings } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import { useNotification } from "../context/NotificationContext";

const TopNavigation: React.FC = () => {
  const { user, hapticFeedback } = useTelegram();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications } = useNotification();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/leaderboard":
        return "Leaderboard";
      case "/statistics":
        return "Statistics";
      case "/profile":
        return "Profile";
      case "/contest":
        return "Contest";
      case "/registration":
        return "Registration";
      default:
        return "Contest App";
    }
  };

  const getProfileImage = () => {
    if (user?.photo_url) {
      return (
        <img
          src={user.photo_url}
          alt={user.first_name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg ring-2 ring-blue-100 dark:ring-blue-900"
        />
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white shadow-lg ring-2 ring-blue-100 dark:ring-blue-900">
        <span className="text-white text-sm font-bold">
          {user?.first_name?.charAt(0) || "U"}
        </span>
      </div>
    );
  };

  const handleNotificationClick = () => {
    hapticFeedback("selection");
    setShowNotifications(true);
  };

  const handleSettingsClick = () => {
    hapticFeedback("selection");
    // Handle settings click
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getProfileImage()}
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Welcome back, {user?.first_name || "Student"}
                {user?.is_premium && (
                  <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                    Premium
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={handleSettingsClick}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default TopNavigation;
