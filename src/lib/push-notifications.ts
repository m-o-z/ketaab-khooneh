import { api } from "@/client"; // Assuming your api client is at this path
import appConfig from "../../app.config";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function getPushSubscription() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
}

export async function createPushSubscription() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    throw new Error("Push messaging is not supported.");
  }

  // Use .ready to wait for the PWA-registered service worker to be active
  const registration = await navigator.serviceWorker.ready;

  const vapidPublicKey = appConfig.pushNotification.public;
  if (!vapidPublicKey) {
    throw new Error("VAPID public key not found.");
  }

  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  // Check if a subscription already exists to avoid re-subscribing
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    return existingSubscription;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });

  // Use your custom API client to send the subscription to the backend
  await api.fetch<void>("/push/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription), // Your API client handles JSON.stringify
  });

  return subscription;
}
