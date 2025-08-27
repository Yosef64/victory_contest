import { useEffect, useState } from "react";
import {
  TelegramWebApp,
  TelegramUser,
  InlineQueryResultArticle,
} from "../types";
import { getPreparedMessageIdTelegram } from "../services/articleService";

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    console.log("Telegram WebApp:", app);
    if (app) {
      app.ready();
      app.setHeaderColor("#8b5cf6");
      app.setBackgroundColor("#ffffff");
      setWebApp(app);
      setUser(app.initDataUnsafe?.user || null);
    }
    setIsLoading(false);
  }, []);

  const sendData = (data: any) => {
    if (webApp) {
      webApp.sendData(JSON.stringify(data));
    }
  };

  const downloadFile = (fileUrl: string, fileName?: string) => {
    if (!webApp?.downloadFile) {
      console.warn("downloadFile is not available on this client");
      return;
    }
    webApp.downloadFile(fileUrl, fileName);
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
  const PrepareAndShareMessageShare = async (
    data: InlineQueryResultArticle
  ) => {
    const payload = {
      user_id: user?.id,
      result: {
        type: "article",
        id: crypto.randomUUID(),
        title: "something",
        input_message_content: {
          message_text: "<strong>Hello</strong>\n\nsomething\n\nRead more",
          parse_mode: "HTML",
        },
        description: "something went wrong",
        thumb_url: "https://picsum.photos/200/300",
        url: "https://picsum.photos/200/300",
      },
      allow_user_chats: true,
      allow_bot_chats: true,
      allow_group_chats: true,
      allow_channel_chats: true,
    };
    const res = await getPreparedMessageIdTelegram(payload);
    const chatId = res?.result?.id;
    if (chatId) {
      if (webApp) {
        return webApp.shareMessage(chatId, (success) => {
          console.log("Shared:", success);
        });
      }
    }
    return;
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
    downloadFile,
    PrepareAndShareMessageShare,
  };
};
