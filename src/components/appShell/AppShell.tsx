"use client";

import React, { useCallback, useEffect, useRef } from "react";

import BottomNavigation from "@/common/BottomNavigation/BottomNavigation";
import Portal from "@/common/Portal/Portal";
import Typography from "@/common/Typography/Typography";
import { usePushNotification } from "@/hooks/usePushNotification";
import { usePWA } from "@/providers/PWAProvider";
import { notifications } from "@mantine/notifications";
import { Button } from "@tapsioss/react-components/Button";

type Props = {
  children: React.ReactNode;
};

const AppShell = ({ children }: Props) => {
  const { subscribe, state, on, off } = usePushNotification();

  const { setHasBottomNavigation } = usePWA();

  const handleSubscribe = useCallback(async () => {
    try {
      await subscribe();

      notifications.hide("notification-status");
    } catch {
      //
    }
  }, [state]);

  const showSubscribedSuccessfully = (_state: typeof state) => {
    if (_state.isSubscribed && !_state.subscribeError) {
      notifications.show({
        autoClose: true,
        color: "green",
        message: (
          <div>
            <Typography.Body size="sm">با موفقیت انجام شد</Typography.Body>
          </div>
        ),
      });
    }
  };

  const showSubscriptionError = (_state: typeof state) => {
    if (_state.subscribeError) {
      notifications.show({
        autoClose: true,
        color: "orange",
        message: (
          <div>
            <Typography.Body size="sm">خطایی رخ داد!</Typography.Body>
          </div>
        ),
      });
    }
  };

  useEffect(() => {
    on("subscribed", showSubscribedSuccessfully);
    on("rejected", showSubscriptionError);
    return () => {
      off("subscribed", showSubscribedSuccessfully);
      off("rejected", showSubscriptionError);
    };
  }, [on]);

  const handleShowingSubscriptionNotification = () => {
    if (
      state.init &&
      !state.isSubscribed &&
      !state.isSubscribing &&
      state.isSupported &&
      state.permissionStatus == "default"
    ) {
      notifications.show({
        id: "notification-status",
        autoClose: false,
        withCloseButton: false,
        message: (
          <div className="space-y-2">
            <Typography.Body size="sm">
              برای اطلاع از آخرین رویداد‌ها اعلان‌ها را فعال نمایید
            </Typography.Body>
            <div className="flex justify-end items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  notifications.hide("notification-status");
                }}
              >
                بعداً
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubscribe}
                loading={state.isSubscribing}
              >
                فعال‌سازی
              </Button>
            </div>
          </div>
        ),
      });
    }
  };

  useEffect(() => {
    console.log({ state });
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
