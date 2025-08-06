self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title || "Ghafaseh Notification";
  if (!data.body) {
    return;
  }

  const options = {
    body: data.body,
    icon: "/icons/manifest-icon-192.maskable.png",
    badge: "/icons/manifest-icon-96.maskable.png",
    image: "/icons/manifest-icon-512.maskable.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
