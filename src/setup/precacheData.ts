import Client from "pocketbase";

import Redis from "@/lib/redis";
import { PocketBaseService } from "@/services/PocketBaseService";
type TRedis = typeof Redis;
export const handler = async () => {
  try {
    const adminClient = await PocketBaseService.AdminClient();
    await Redis.flushall();
    void handleAddingTestUsers(adminClient, Redis);
  } catch (error) {
    console.log({ error });
  }
};

const handleAddingTestUsers = async (client: Client, redis: TRedis) => {
  const testUsers = await retrieveTestUsers(client);
  void redis.set("test-users", JSON.stringify(testUsers));
};

const retrieveTestUsers = async (client: Client) => {
  const result = await client.collection("test_users").getFullList();
  return result;
};
