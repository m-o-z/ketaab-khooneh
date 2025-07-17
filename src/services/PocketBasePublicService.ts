import PocketBase from "pocketbase";
import appConfig from "../../app.config";
export default class PocketBasePublicService {
  static Client() {
    return new PocketBase(appConfig.pocketbase.baseURL);
  }
}
