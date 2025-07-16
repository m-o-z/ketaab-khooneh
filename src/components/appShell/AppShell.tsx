"use client";

import React, { useCallback, useEffect } from "react";

// import styles from "./AppShell.module.scss";

import BottomNavigation from "@/common/BottomNavigation/BottomNavigation";
import Portal from "@/common/Portal/Portal";
import { usePWA } from "@/providers/PWAProvider";
import { usePushNotification } from "@/hooks/usePushNotification";
import { Button } from "@tapsioss/react-components/Button";
import { notifications } from "@mantine/notifications";
import Typography from "@/common/Typography/Typography";

type Props = {
  children: React.ReactNode;
};

const AppShell = ({ children }: Props) => {
  const { subscribe, state } = usePushNotification();

  const { setHasBottomNavigation } = usePWA();

  const handleShowingSubscriptionNotification = useCallback(() => {
    if (
      !state.isSubscribed &&
      !state.isSubscribing &&
      state.isSupported &&
      state.permissionStatus == "default"
    ) {
      const id = notifications.show({
        autoClose: false,
        withCloseButton: false,
        message: (
          <div className="space-y-2">
            <Typography.Body size="sm">
              برای دسترسی به اطلاعات لحظه‌ای باید دسترسی به Notificationها را
              بدهید
            </Typography.Body>
            <div className="flex justify-end items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  notifications.hide(id);
                }}
              >
                بستن
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  subscribe();

                  requestAnimationFrame(() => {
                    notifications.hide(id);
                  });
                }}
              >
                تایید دسترسی
              </Button>
            </div>
          </div>
        ),
      });
    }
  }, [state]);

  useEffect(() => {
    handleShowingSubscriptionNotification();
  }, [state]);

  useEffect(() => {
    setHasBottomNavigation();
  }, []);

  return (
    <div className="h-full w-full pb-[6.25rem] px-4 pt-4 relative">
      {children}
      <Portal id="#bottom-navigation">
        <BottomNavigation />
      </Portal>
    </div>
  );
};

export default AppShell;
