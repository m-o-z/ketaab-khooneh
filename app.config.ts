export default {
  apiURL: process.env.NEXT_PUBLIC_API_URL,
  pushNotification: {
    public: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  },
  pocketbase: {
    baseURL: process.env.NEXT_PUBLIC_POCKETBASE_URL,
  },
  auth: {
    daysToRefresh: process.env.NEXT_PUBLIC_DAYS_TO_REFRESH,
  },
};
