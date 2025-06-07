import PocketBase from "pocketbase";

const pbClient = () => new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export default pbClient;
