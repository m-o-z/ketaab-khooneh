import Client from "pocketbase";
import webpush, { PushSubscription } from "web-push";
import { PushSubscriptionDB } from "@/schema/pushSubscription";
import { BaseService } from "./BaseService";
import { PushSubscriptionDBCreatePayload } from "@/schema/pushSubscription";
import { PushSubscriptionPayload } from "@/app/api/push/subscribe/route.schema";
import appConfig from "../../app.config";
import privateConfig from "../../private.config";

// --- Type Definitions ---

type NotificationPayload = {
  title: string;
  body: string;
  url?: string; // Optional URL to open on click
};

class PushSubscriptionService extends BaseService {
  private isWebPushConfigured = false;

  constructor() {
    super();
    this.configureWebPush();
  }

  /**
   * Configures the web-push library with VAPID keys from environment variables.
   * This only needs to be done once when the service is instantiated.
   */
  private configureWebPush() {
    const vapidPublicKey = appConfig.pushNotification.public;
    const vapidPrivateKey = privateConfig.pushNotification.private;

    if (vapidPublicKey && vapidPrivateKey) {
      webpush.setVapidDetails(
        "mailto:hossein.nasiri.sovari@gmail.com", // Replace with your contact email
        vapidPublicKey,
        vapidPrivateKey,
      );
      this.isWebPushConfigured = true;
    } else {
      console.error(
        "VAPID keys are not configured. Push notifications will not work.",
      );
    }
  }

  /**
   * Creates a new push subscription record in the database for a given user.
   * @param subscription - The PushSubscription object from the browser.
   * @param userId - The ID of the user to associate with the subscription.
   */
  public async createPushSubscription(
    subscription: PushSubscriptionPayload,
    userId: string,
  ): Promise<PushSubscriptionDB> {
    const client = await this._adminClient();
    const payload: PushSubscriptionDBCreatePayload = {
      user: userId,
      expirationTime: subscription.expirationTime,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    };

    // Check if a subscription with this endpoint already exists to avoid duplicates
    try {
      const existing = await client
        .collection<PushSubscriptionDB>("push_subscriptions")
        .getFirstListItem(`endpoint = "${payload.endpoint}"`);
      // If it exists but for a different user, update it. If for the same user, just return it.
      if (existing.user !== userId) {
        return await client
          .collection<PushSubscriptionDB>("push_subscriptions")
          .update(existing.id, { user: userId });
      }
      return existing;
    } catch (error: any) {
      // A 404 error means it doesn't exist, which is expected.
      if (error.status === 404) {
        return await client
          .collection<PushSubscriptionDB>("push_subscriptions")
          .create(payload);
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }

  /**
   * Sends a push notification to a single user.
   * @param userId - The ID of the user to notify.
   * @param payload - The content of the notification.
   */
  public async sendPushNotification(
    userId: string,
    payload: NotificationPayload,
  ): Promise<void> {
    if (!this.isWebPushConfigured) return;

    const client = await this._adminClient();
    const subscriptions = await client
      .collection<PushSubscriptionDB>("push_subscriptions")
      .getFullList({ filter: `user = "${userId}"` });

    await this.sendNotificationsToSubscriptions(subscriptions, payload, client);
  }

  /**
   * Sends the same push notification to multiple users.
   * @param userIds - An array of user IDs to notify.
   * @param payload - The content of the notification.
   */
  public async sendBatchPushNotification(
    userIds: string[],
    payload: NotificationPayload,
  ): Promise<void> {
    if (!this.isWebPushConfigured || userIds.length === 0) return;

    const client = await this._adminClient();
    // Create a filter string like: user = "id1" || user = "id2" || ...
    const filter = userIds.map((id) => `user = "${id}"`).join(" || ");
    const subscriptions = await client
      .collection<PushSubscriptionDB>("push_subscriptions")
      .getFullList({ filter });

    await this.sendNotificationsToSubscriptions(subscriptions, payload, client);
  }

  /**
   * Sends the same push notification to all users.
   * @param payload - The content of the notification.
   */
  public async broadcastPushNotification(
    payload: NotificationPayload,
  ): Promise<void> {
    if (!this.isWebPushConfigured) return;

    const client = await this._adminClient();
    // Create a filter string like: user = "id1" || user = "id2" || ...
    const subscriptions = await client
      .collection<PushSubscriptionDB>("push_subscriptions")
      .getFullList();

    await this.sendNotificationsToSubscriptions(subscriptions, payload, client);
  }

  /**
   * Helper function to iterate through subscriptions and send notifications.
   * It handles expired subscriptions by deleting them.
   */
  private async sendNotificationsToSubscriptions(
    subscriptions: PushSubscriptionDB[],
    payload: NotificationPayload,
    client: Client,
  ) {
    const notificationPayload = JSON.stringify(payload);

    const promises = subscriptions.map((sub) => {
      const pushSubscription: PushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush
        .sendNotification(pushSubscription, notificationPayload)
        .catch(async (error) => {
          // If the subscription is expired or invalid, the push service returns a 410 Gone status.
          if (error.statusCode === 410) {
            console.log(`Subscription ${sub.id} is expired. Deleting.`);
            // Delete the invalid subscription from the database.
            await client.collection("push_subscriptions").delete(sub.id);
          } else {
            console.error(
              `Failed to send notification to ${sub.endpoint}:`,
              error,
            );
          }
        });
    });

    await Promise.allSettled(promises);
  }
}

const instance =
  PushSubscriptionService.GetInstance() as PushSubscriptionService;
export default instance;
