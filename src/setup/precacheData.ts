import { pbAdminClient } from "@/client/pbClient";
import Redis from "@/lib/redis";
export const handler = async () => {
  const client = pbAdminClient();
  await Redis.flushall();

  try {
    let result = await Redis.get("test");
    if (result != "value") {
      await Redis.set("test", "value");
      let result = await Redis.get("test");
    }
  } catch (error) {
    console.log({ error });
  }
};
