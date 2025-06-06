import { usePWA } from "@/providers/PWAProvider";
import {
  Notifications as MantineNotifications,
  notifications,
} from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { CSSProperties, useEffect } from "react";

const Notifications = () => {
  const { safeAreaInsets, isStandalone, hasBottomNavigation } = usePWA();

  const cssProperties = () => {
    if (!hasBottomNavigation) {
      return {
        "--mantine-notification-bottom": "1rem",
      };
    }
    if (isStandalone && safeAreaInsets.bottom > 0) {
      return {
        "--mantine-notification-bottom": "calc(5.5rem + 1rem)",
      };
    }
    return {
      "--mantine-notification-bottom": "calc(4.5rem + 1rem)",
    };
  };

  return (
    <MantineNotifications
      style={
        {
          ...cssProperties(),
        } as CSSProperties
      }
      withinPortal={true}
      position="bottom-center"
      limit={3}
    />
  );
};

export default Notifications;
