import { useEffect, useState } from 'react';
import { TelegramWebApp, TelegramUser } from '../types';

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (app) {
      app.ready();
      app.expand();
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

  const hapticFeedback = (type: 'impact' | 'notification' | 'selection', style?: string) => {
    if (webApp) {
      switch (type) {
        case 'impact':
          webApp.HapticFeedback.impactOccurred(style as any || 'medium');
          break;
        case 'notification':
          webApp.HapticFeedback.notificationOccurred(style as any || 'success');
          break;
        case 'selection':
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
    close
  };
};