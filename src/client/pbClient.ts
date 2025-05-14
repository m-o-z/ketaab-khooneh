import PocketBase from "pocketbase";

console.log({
  URL: process.env.NEXT_PUBLIC_POCKETBASE_URL,
});
const pbClient = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export default pbClient;
