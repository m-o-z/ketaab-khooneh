import Client from "pocketbase";

import Redis from "@/lib/redis";
import { PocketBaseService } from "@/services/PocketBaseService";
type TRedis = typeof Redis;
export const handler = async () => {
  try {
    const adminClient = (await PocketBaseService.GetInstance()).admin;
    await Redis.flushall();
    handleAddingTestUsers(adminClient, Redis);
  } catch (error) {
    console.log({ error });
  }
};

const handleAddingTestUsers = async (client: Client, redis: TRedis) => {
  const testUsers = await retrieveTestUsers(client);
  redis.set("test-users", JSON.stringify(testUsers));
};

const retrieveTestUsers = async (client: Client) => {
  const result = await client.collection("test_users").getFullList();
  return result;
};
