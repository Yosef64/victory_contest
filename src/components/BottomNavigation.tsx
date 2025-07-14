import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  BarChart3, 
  User, 
} from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/statistics', icon: BarChart3, label: 'Stats' },
    { path: '/profile', icon: User, label: 'Profile' },
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
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[70px] ${
                isActive 
                  ? 'text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transform scale-110' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10 scale-110"></div>
              )}
              
              <Icon size={isActive ? 24 : 22} className={`mb-1 transition-all duration-300 ${isActive ? 'drop-shadow-sm' : ''}`} />
              <span className={`text-xs font-semibold transition-all duration-300 ${isActive ? 'drop-shadow-sm' : ''}`}>
                {item.label}
              </span>
              
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -top-1 w-2 h-2 bg-white rounded-full shadow-sm"></div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;