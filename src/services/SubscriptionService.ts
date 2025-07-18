import Client from "pocketbase";
import { ListQueryPageOptions } from "@/@types/pocketbase";
import {
  SubscriptionCoreSchema,
  SubscriptionDB,
  CreateSubscriptionPayload,
  DeleteSubscriptionPayload,
  FindSubscriptionPayload,
} from "@/schema/subscription";

import { BaseService } from "./BaseService";
import { errorBadRequest } from "@/utils/errors/errors";

type FindSubscriptionsParams = {
  targetCollection: string;
  recordId: string;
  type: string | string[];
  expand?: string;
} & ListQueryPageOptions;

class SubscriptionService extends BaseService {
  /**
   * Creates a filter string for one or more event types.
   * @param type - A single event type string or an array of strings.
   * @returns A PocketBase filter string component.
   */
  private createTypeQuery(type: string | string[]) {
    if (Array.isArray(type)) {
      if (type.length === 0) return "";
      return `(${type.map((value) => `type = "${value}"`).join(" || ")})`;
    }
    return `type = "${type}"`;
  }

  /**
   * A generic private method to find subscriptions based on a filter.
   */
  private async findSubscriptionsByFilter({
    targetCollection,
    recordId,
    type,
    page,
    perPage,
    expand = "user,actor",
  }: FindSubscriptionsParams) {
    const client = await this._adminClient();

    const typeFilter = this.createTypeQuery(type);

    const filter = [
      `targetCollection = "${targetCollection}"`,
      `recordId = "${recordId}"`,
      typeFilter,
    ]
      .filter(Boolean) // Remove empty strings from the array
      .join(" && ");

    const result = await client
      .collection<SubscriptionDB>("subscriptions")
      .getList(page, perPage, {
        filter,
        sort: "-created",
        expand,
      });

    const { items, ...meta } = result;

    const subscriptionsCore = SubscriptionCoreSchema.array().parse(
      result.items,
    );
    return {
      subscriptionsCore,
      items,
      meta,
    };
  }

  /**
   * Creates a new subscription record in the database.
   * @param payload - The data needed to create the subscription.
   * @returns The newly created subscription, parsed into a Core object.
   */
  public async createSubscription(payload: CreateSubscriptionPayload) {
    const client = await this._adminClient();

    const result = await this.findSubscription(payload);

    if (result != null) {
      throw new Error("You have subscribed already");
    }

    const record = await client
      .collection<SubscriptionDB>("subscriptions")
      .create(payload, { expand: "user,actor" });

    return SubscriptionCoreSchema.parse(record);
  }

  /**
   * Deletes a old subscription record in the database.
   * @param payload - The data needed to create the subscription.
   * @returns The result of end result in boolean
   */
  public async deleteSubscription(payload: DeleteSubscriptionPayload) {
    const client = await this._adminClient();

    const { subscriptionsCore: records } = await this.findSubscriptions(
      payload.targetCollection,
      payload.recordId,
      payload.type,
      {
        page: 1,
        perPage: 1,
      },
    );

    if (records.length === 1) {
      return await client
        .collection<SubscriptionDB>("subscriptions")
        .delete(records[0].id);
    }

    return false;
  }

  /**
   * Finds a record of subscriptions
   * @param payload - The data needed to create the subscription.
   * @returns The result of end result in boolean
   */
  public async findSubscription(
    payload: FindSubscriptionPayload,
    throwOnExtraRecords: boolean = false,
  ) {
    const client = await this._adminClient();

    const { subscriptionsCore: records } = await this.findSubscriptions(
      payload.targetCollection,
      payload.recordId,
      payload.type,
      {
        page: 1,
        perPage: 999,
      },
    );

    if (records.length === 1) {
      return records[0];
    } else if (
      records.length === 0 ||
      (!throwOnExtraRecords && records.length > 1)
    ) {
      return null;
    } else {
      throw new Error(`Found extra records in "${payload.targetCollection}"`);
    }
  }

  /**
   * Finds all subscriptions for a specific event on a record.
   * @param targetCollection - The collection name (e.g., 'posts').
   * @param recordId - The ID of the record being watched.
   * @param type - The event type (e.g., 'comment_created').
   * @param options - Pagination options.
   * @returns A paginated list of subscriptions.
   */
  public async findSubscriptions(
    targetCollection: string,
    recordId: string,
    type: string | string[],
    options: ListQueryPageOptions,
  ) {
    return this.findSubscriptionsByFilter({
      targetCollection,
      recordId,
      type,
      ...options,
    });
  }
}

const instance = SubscriptionService.GetInstance() as SubscriptionService;

export default instance;
