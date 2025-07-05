import PocketBase from "pocketbase";
export default class PocketBasePublicService {
  static Client() {
    return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  }
}
