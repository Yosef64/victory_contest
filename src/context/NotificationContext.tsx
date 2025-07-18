import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useTelegram } from "../hooks/useTelegram";
import { getNotification } from "../services/notificationService";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: React.ComponentType<any>;
  color?: string;
  actionUrl?: string;
}

interface NotificationContextProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  notificationLoading: boolean;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const { user } = useTelegram();

  useEffect(() => {
    const fetchNotification = async () => {
      if (!user?.id) return;
      setNotificationLoading(true);
      try {
        const res = await getNotification(user.id);
        setNotifications(res);
      } catch (e) {
        setNotifications([]);
      } finally {
        setNotificationLoading(false);
      }
    };
    fetchNotification();
  }, [user?.id]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, notificationLoading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
