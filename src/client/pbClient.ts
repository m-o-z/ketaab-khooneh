import PocketBase from "pocketbase";

const pbClient = () => new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export const pbAdminClient = async () => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.autoCancellation(false);
  await pb
    .collection("_superusers")
    .authWithPassword("hossein.nasiri.sovari@gmail.com", "test@test");

  const isValid = pb.authStore.isValid;
  const record = pb.authStore.record;
  return pb;
};

export default pbClient;
