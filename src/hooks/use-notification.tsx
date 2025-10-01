import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Este navegador no soporta notificaciones");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        toast.success("Notificaciones activadas");
        return true;
      } else {
        toast.error("Permisos de notificación denegados");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });
    }
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: "Notification" in window,
  };
};
