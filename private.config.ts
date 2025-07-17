import "./envConfig.ts";

console.log({ env: process.env });

export default {
  pushNotification: {
    private: process.env.VAPID_PRIVATE_KEY,
  },
  pocketbase: {
    username: process.env.POCKETBASE_ADMIN_USERNAME,
    password: process.env.POCKETBASE_ADMIN_PASSWORD,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};
