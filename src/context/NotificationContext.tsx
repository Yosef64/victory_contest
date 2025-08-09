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
  id: string;
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
        // const res = await getNotification(user.id);
        // // Transform backend response to match frontend interface
        // const transformedNotifications = res.map((notification: any) => ({
        //   id: notification.id,
        //   type: notification.type,
        //   title: notification.title,
        //   message: notification.message,
        //   timestamp: notification.sent_at,
        //   read: notification.is_read,
        // }));
        // setNotifications(transformedNotifications);
      } catch (e) {
        setNotifications([]);
      } finally {
        setNotificationLoading(false);
      }
    };

    fetchNotification();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchNotification, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, notificationLoading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
