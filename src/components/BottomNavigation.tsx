import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Trophy, BarChart3, User } from "lucide-react";

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/statistics", icon: BarChart3, label: "Stats" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center"
            >
              <div
                className={`relative flex flex-col items-center py-1 justify-center  rounded-xl transition-all duration-200 min-w-[70px] ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <Icon size={22} className="mb-1 transition-all duration-200" />
              </div>

              <span
                className={`text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
