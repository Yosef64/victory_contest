import { useEffect, useState } from "react";
import { TelegramWebApp, TelegramUser } from "../types";

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initTelegram = () => {
      const app = window.Telegram?.WebApp;
      if (app) {
        console.log("Telegram WebApp found, initializing...", app);
        app.ready();
        app.expand();
        setWebApp(app);
        const telegramUser = app.initDataUnsafe?.user || null;
        console.log("Telegram user data:", telegramUser);
        setUser(telegramUser);
        setIsLoading(false);
      } else {
        console.log("Telegram WebApp not found, retrying...");
        // If Telegram WebApp is not available, wait a bit and try again
        setTimeout(initTelegram, 100);
      }
    };

    // Check if Telegram script is loaded
    if (typeof window !== "undefined") {
      console.log("Window object available, checking for Telegram...");
      if (window.Telegram?.WebApp) {
        console.log("Telegram WebApp available immediately");
        initTelegram();
      } else {
        // Wait for Telegram script to load
        const checkTelegram = setInterval(() => {
          if (window.Telegram?.WebApp) {
            clearInterval(checkTelegram);
            initTelegram();
          }
        }, 100);

        // Fallback: stop checking after 5 seconds
        setTimeout(() => {
          clearInterval(checkTelegram);
          setIsLoading(false);
        }, 5000);
      }
    } else {
      console.log("Window object not available (SSR)");
      setIsLoading(false);
    }
  }, []);

  const sendData = (data: any) => {
    if (webApp) {
      webApp.sendData(JSON.stringify(data));
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (webApp) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    if (webApp) {
      webApp.MainButton.hide();
    }
  };

  const showBackButton = (onClick: () => void) => {
    if (webApp) {
      webApp.BackButton.onClick(onClick);
      webApp.BackButton.show();
    }
  };

  const hideBackButton = () => {
    if (webApp) {
      webApp.BackButton.hide();
    }
  };

  const hapticFeedback = (
    type: "impact" | "notification" | "selection",
    style?: string
  ) => {
    if (webApp) {
      switch (type) {
        case "impact":
          webApp.HapticFeedback.impactOccurred((style as any) || "medium");
          break;
        case "notification":
          webApp.HapticFeedback.notificationOccurred(
            (style as any) || "success"
          );
          break;
        case "selection":
          webApp.HapticFeedback.selectionChanged();
          break;
      }
    }
  };

  const close = () => {
    if (webApp) {
      webApp.close();
    }
  };

  const setHeaderColor = (color: string) => {
    if (webApp) {
      webApp.setHeaderColor(color);
    }
  };

  const setBackgroundColor = (color: string) => {
    if (webApp) {
      webApp.setBackgroundColor(color);
    }
  };

  const showPopup = (
    title: string,
    message: string,
    buttons?: Array<{ id: string; type?: string; text: string }>
  ) => {
    if (webApp) {
      webApp.showPopup(
        {
          title,
          message,
          buttons: buttons || [{ id: "ok", type: "ok", text: "OK" }],
        },
        (buttonId) => {
          console.log("Popup button clicked:", buttonId);
        }
      );
    }
  };

  const showAlert = (message: string) => {
    if (webApp) {
      webApp.showAlert(message);
    }
  };

  const showConfirm = (
    message: string,
    callback: (confirmed: boolean) => void
  ) => {
    if (webApp) {
      webApp.showConfirm(message, callback);
    }
  };

  const openLink = (url: string) => {
    if (webApp) {
      webApp.openLink(url);
    }
  };

  const openTelegramLink = (url: string) => {
    if (webApp) {
      webApp.openTelegramLink(url);
    }
  };

  const requestWriteAccess = () => {
    if (webApp) {
      webApp.requestWriteAccess((granted) => {
        console.log("Write access:", granted);
      });
    }
  };

  const requestContact = () => {
    if (webApp) {
      webApp.requestContact((shared) => {
        console.log("Contact shared:", shared);
      });
    }
  };

  const enableClosingConfirmation = () => {
    if (webApp) {
      webApp.enableClosingConfirmation();
    }
  };

  const disableClosingConfirmation = () => {
    if (webApp) {
      webApp.disableClosingConfirmation();
    }
  };

  const switchInlineQuery = (query: string, chatTypes?: string[]) => {
    if (webApp) {
      webApp.switchInlineQuery(query, chatTypes);
    }
  };

  const readTextFromClipboard = () => {
    if (webApp) {
      return webApp.readTextFromClipboard();
    }
    return null;
  };
  return {
    webApp,
    user,
    isLoading,
    sendData,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    close,
    setHeaderColor,
    setBackgroundColor,
    showPopup,
    showAlert,
    showConfirm,
    openLink,
    openTelegramLink,
    requestWriteAccess,
    requestContact,
    enableClosingConfirmation,
    disableClosingConfirmation,
    switchInlineQuery,
    readTextFromClipboard,
  };
};
