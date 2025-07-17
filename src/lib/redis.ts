import Redis from "ioredis";
import privateConfig from "../../private.config";
declare global {
  var redis: Redis | undefined;
}

let redis: Redis; // Changed from `let redis;` to `let redis: Redis;` for type safety

if (process.env.NODE_ENV === "production") {
  redis = new Redis({
    host: privateConfig.redis.host || "localhost",
    port: parseInt(privateConfig.redis.port || "6379", 10),
  });
} else {
  // In development, use a global variable to avoid multiple instances
  // across hot-reloads in Next.js
  if (!global.redis) {
    global.redis = new Redis({
      host: privateConfig.redis.host || "localhost",
      port: parseInt(privateConfig.redis.port || "6379", 10),
    });
  }
  redis = global.redis;
}

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis!");
});

export default redis; // Removed `as Redis` as it's already typed as Redis
