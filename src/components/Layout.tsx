import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import BottomNavigation from './BottomNavigation';
import TopNavigation from './TopNavigation';

const Layout: React.FC = () => {
  const { webApp } = useTelegram();

  const getThemeStyles = () => {
    if (!webApp) return {};
    
    const theme = webApp.themeParams;
    return {
      backgroundColor: theme.bg_color || '#ffffff',
      color: theme.text_color || '#000000',
      '--primary-color': theme.button_color || '#0088cc',
      '--secondary-color': theme.secondary_bg_color || '#f5f5f5',
      '--text-color': theme.text_color || '#000000',
      '--hint-color': theme.hint_color || '#999999',
      '--link-color': theme.link_color || '#0088cc',
    } as React.CSSProperties;
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900"
      style={getThemeStyles()}
    >
      <TopNavigation />
      <main className="flex-1 pt-16 pb-20 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;