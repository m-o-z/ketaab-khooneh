import { pbAdminClient } from "@/client/pbClient";
import Redis from "@/lib/redis";
import Client from "pocketbase";
type TRedis = typeof Redis;
export const handler = async () => {
  try {
    const client = await pbAdminClient();
    await Redis.flushall();
    handleAddingTestUsers(client, Redis);
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
