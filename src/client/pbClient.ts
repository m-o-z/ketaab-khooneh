import PocketBase from "pocketbase";

const pbClient = () => new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export const pbAdminClient = async () => {
  const usr = process.env.POCKETBASE_ADMIN_USERNAME ?? "admin";
  const pw = process.env.POCKETBASE_ADMIN_PASSWORD ?? "admin";
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.autoCancellation(false);
  await pb.collection("_superusers").authWithPassword(usr, pw);

  const isValid = pb.authStore.isValid;
  const record = pb.authStore.record;
  return pb;
};

export default pbClient;
