"use client";

import {
  createPushSubscription,
  getPushSubscription,
} from "@/lib/push-notifications";
import { useEffect, useState } from "react";

type PushNotificationState = {
  isSubscribed: boolean;
  isSubscribing: boolean;
  subscribeError: Error | null;
  permissionStatus: NotificationPermission | "default";
  isSupported: boolean;
};

export function usePushNotification() {
  const [state, setState] = useState<PushNotificationState>({
    isSubscribed: false,
    isSubscribing: false,
    subscribeError: null,
    permissionStatus: "default",
    isSupported: false,
  });

  useEffect(() => {
    const checkSupportAndStatus = async () => {
      const isSupported =
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window;

      const permission = isSupported ? Notification.permission : "default";
      const subscription = await getPushSubscription();

      setState({
        isSupported,
        permissionStatus: permission,
        isSubscribed: !!subscription,
        isSubscribing: false,
        subscribeError: null,
      });
    };

    checkSupportAndStatus();
  }, []);

  const subscribe = async () => {
    if (!state.isSupported) {
      const error = new Error(
        "Push notifications are not supported by this browser.",
      );
      setState((prevState) => ({ ...prevState, subscribeError: error }));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isSubscribing: true,
      subscribeError: null,
    }));

    try {
      await createPushSubscription();
      setState((prevState) => ({
        ...prevState,
        isSubscribed: true,
        isSubscribing: false,
        permissionStatus: "granted",
      }));
    } catch (error) {
      console.error(error);
      setState((prevState) => ({
        ...prevState,
        isSubscribed: false,
        isSubscribing: false,
        subscribeError: error as Error,
        permissionStatus: Notification.permission,
      }));
    }
  };

  return {
    state,
    subscribe,
  };
}
