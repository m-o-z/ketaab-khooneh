"use client";

import { Notifications as MantineNotifications } from "@mantine/notifications";
import { CSSProperties, useMemo } from "react";

import { usePWA } from "@/providers/PWAProvider";

import "@mantine/notifications/styles.css";
import { useWindowSize } from "@/hooks/useWindowSize";

const Notifications = () => {
  const { maxWidth, width } = useWindowSize();
  const { safeAreaInsets, isStandalone, hasBottomNavigation } = usePWA();

  const cssProperties = () => {
    if (!hasBottomNavigation) {
      return {
        "--mantine-notification-bottom": "1rem",
      };
    }
    if (isStandalone && safeAreaInsets.bottom > 0) {
      return {
        "--mantine-notification-bottom": "calc(4.5rem + 1rem)",
      };
    }
    return {
      "--mantine-notification-bottom": "calc(3.5rem + 1rem)",
    };
  };

  const containerWidth = useMemo(() => {
    if (width > maxWidth) {
      return maxWidth - 32;
    }
    return width - 32;
  }, [maxWidth, width]);

  return (
    <MantineNotifications
      withinPortal
      limit={3}
      position="bottom-center"
      styles={{
        root: {
          marginBottom: "var(--mantine-notification-bottom)",
          minWidth: `${containerWidth}px`,
          "--notifications-container-width": `${containerWidth - 32}px`,
          maxWidth: "calc(100%-2rem)",
          transition: "all .3s ease-out",
        },
      }}
      style={
        {
          "--notifications-container-width": `${containerWidth - 32}px`,
          ...cssProperties(),
        } as CSSProperties
      }
    />
  );
};

export default Notifications;
