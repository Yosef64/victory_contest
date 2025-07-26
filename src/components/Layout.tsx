import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import BottomNavigation from "./BottomNavigation";
import TopNavigation from "./TopNavigation";
import { Toaster } from "sonner";
import { NotificationProvider } from "../context/NotificationContext";

const Layout: React.FC = () => {
  const { webApp } = useTelegram();

  useEffect(() => {
    if (webApp) {
      const theme = webApp.themeParams;
      const isDark = isDarkColor(theme.bg_color || "#ffffff");
      document.documentElement.setAttribute(
        "data-mode",
        isDark ? "dark" : "light"
      );
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );

      document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        theme.bg_color || "#ffffff"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-text-color",
        theme.text_color || "#000000"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-hint-color",
        theme.hint_color || "#999999"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-link-color",
        theme.link_color || "#2481cc"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-color",
        theme.button_color || "#2481cc"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-text-color",
        theme.button_text_color || "#ffffff"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-secondary-bg-color",
        theme.secondary_bg_color || "#f5f5f5"
      );
    }
  }, [webApp]);

  const isDarkColor = (color: string): boolean => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const getThemeStyles = () => {
    if (!webApp) return {};

    const theme = webApp.themeParams;
    return {
      backgroundColor: theme.bg_color || "#ffffff",
      color: theme.text_color || "#000000",
      "--primary-color": theme.button_color || "#0088cc",
      "--secondary-color": theme.secondary_bg_color || "#f5f5f5",
      "--text-color": theme.text_color || "#000000",
      "--hint-color": theme.hint_color || "#999999",
      "--link-color": theme.link_color || "#0088cc",
    } as React.CSSProperties;
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900"
      style={getThemeStyles()}
    >
      <NotificationProvider>
        <TopNavigation />
      </NotificationProvider>
      <main className="flex-1 pt-16 pb-20 overflow-y-auto">
        <Outlet />
        <Toaster />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Layout;
