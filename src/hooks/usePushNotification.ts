"use client";

import {
  createPushSubscription,
  getPushSubscription,
  unsubscribePushSubscriptions,
} from "@/lib/push-notifications";
import mitt from "mitt";
import { tick } from "@/utils/eventQueue";
import { useCallback, useEffect, useState } from "react";

type PushNotificationState = {
  init: boolean;
  isSubscribed: boolean;
  isSubscribing: boolean;
  subscribeError: Error | null;
  permissionStatus: NotificationPermission | "default";
  isSupported: boolean;
};

type Events = {
  "*"?: never;
  init?: never;
  subscribing: PushNotificationState;
  subscribed: PushNotificationState;
  rejected: PushNotificationState;
  unsubscribing?: never;
  unsubscribed?: never;
};
export function usePushNotification() {
  const [emitter] = useState(() => mitt<Events>());
  const [state, setState] = useState<PushNotificationState>({
    init: false,
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
      console.log({
        notif: window.Notification,
        sw: navigator.serviceWorker,
        pm: window.PushManager,
      });

      emitter.emit("init");

      setState({
        init: true,
        isSupported,
        permissionStatus: permission,
        isSubscribed: !!subscription,
        isSubscribing: false,
        subscribeError: null,
      });
    };

    checkSupportAndStatus();
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!state.isSupported) {
      const error = new Error(
        "Push notifications are not supported by this browser.",
      );
      setState((prevState) => ({ ...prevState, subscribeError: error }));
      return;
    }

    try {
      await unsubscribePushSubscriptions();
      setState((prevState) => {
        let nextState = {
          ...prevState,
          isSubscribed: false,
          isSubscribing: false,
          permissionStatus: Notification.permission,
        } as PushNotificationState;

        emitter.emit("unsubscribed");
        return nextState;
      });
    } catch (error) {
      setState((prevState) => {
        let nextState = {
          ...prevState,
          isSubscribed: false,
          isSubscribing: false,
          subscribeError: error as Error,
          permissionStatus: Notification.permission,
        } as PushNotificationState;
        return nextState;
      });
    } finally {
      await tick();
    }
  }, [state]);

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
      setState((prevState) => {
        let nextState = {
          ...prevState,
          isSubscribed: true,
          isSubscribing: false,
          permissionStatus: "granted",
        } as PushNotificationState;

        emitter.emit("subscribed", nextState);
        return nextState;
      });
    } catch (error) {
      setState((prevState) => {
        let nextState = {
          ...prevState,
          isSubscribed: false,
          isSubscribing: false,
          subscribeError: error as Error,
          permissionStatus: Notification.permission,
        } as PushNotificationState;

        emitter.emit("rejected", nextState);
        return nextState;
      });
    } finally {
      await tick();
    }
  };

  useEffect(() => {
    return () => {
      emitter.off("*");
    };
  }, []);

  return {
    on: emitter.on,
    off: emitter.off,
    state,
    subscribe,
    unsubscribe,
  };
}
