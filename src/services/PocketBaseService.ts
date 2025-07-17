import PocketBase from "pocketbase";
import privateConfig from "../../private.config";
import appConfig from "../../app.config";

export class PocketBaseService {
  private static adminToken: string | null = null;

  /** Initializes and caches admin token (called once at startup) */
  public static async Init() {
    if (this.adminToken) return;

    const usr = privateConfig.pocketbase.username ?? "admin";
    const pw = privateConfig.pocketbase.password ?? "admin";

    const pb = new PocketBase(appConfig.pocketbase.baseURL);
    const authData = await pb
      .collection("_superusers")
      .authWithPassword(usr, pw);

    if (!pb.authStore.isValid) {
      throw new Error(
        "Can not authorize with these credentials into PocketBase",
      );
    }

    this.adminToken = authData.token;
  }

  /** Get a fresh admin client per request */
  public static async AdminClient(): Promise<PocketBase> {
    if (!this.adminToken) {
      await this.Init(); // Make sure token is initialized
    }

    const pb = new PocketBase(appConfig.pocketbase.baseURL);
    pb.authStore.save(this.adminToken!, null); // Restore the token
    return pb;
  }

  /** Create a fresh unauthenticated client */
  public static Client(): PocketBase {
    return new PocketBase(appConfig.pocketbase.baseURL);
  }
}
