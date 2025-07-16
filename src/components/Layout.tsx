import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";
import BottomNavigation from "./BottomNavigation";
import TopNavigation from "./TopNavigation";

const Layout: React.FC = () => {
  const { webApp } = useTelegram();

  useEffect(() => {
    if (webApp) {
      const theme = webApp.themeParams;
      // Check if bg_color is dark (e.g., colors starting with #0, #1, #2 or low brightness)
      const isDark = isDarkColor(theme.bg_color || "#ffffff");

      // Set data-mode and data-theme attributes
      document.documentElement.setAttribute(
        "data-mode",
        isDark ? "dark" : "light"
      );
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );

      // Update CSS custom properties to match Telegram theme
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

  // Helper function to determine if a color is dark
  const isDarkColor = (color: string): boolean => {
    // Remove # from hex color
    const hex = color.replace("#", "");
    // Convert hex to RGB
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    // Calculate perceived brightness using luminance formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Consider color dark if brightness is below 128 (out of 255)
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
      <TopNavigation />
      <main className="flex-1 pt-16 pb-20 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
