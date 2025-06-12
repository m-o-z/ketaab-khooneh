import Redis from "ioredis";
declare global {
  var redis: Redis | undefined;
}

const redisHost = process.env.REDIS_HOST;
console.log({ redisHost, env: process.env });

let redis: Redis; // Changed from `let redis;` to `let redis: Redis;` for type safety

if (process.env.NODE_ENV === "production") {
  redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  });
} else {
  // In development, use a global variable to avoid multiple instances
  // across hot-reloads in Next.js
  if (!global.redis) {
    global.redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
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
