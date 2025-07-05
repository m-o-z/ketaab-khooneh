import PocketBase from "pocketbase";

export class PocketBaseService {
  private static instance: PocketBaseService | null = null;
  private _admin: PocketBase | null = null;
  private constructor(admin: PocketBase) {
    this._admin = admin;
  }

  public static async GetInstance() {
    if (this.instance) {
      return this.instance;
    }

    const admin = await this.initPocketBaseAdminClient();
    this.instance = new PocketBaseService(admin);
    return this.instance;
  }

  private static async initPocketBaseAdminClient() {
    const usr = process.env.POCKETBASE_ADMIN_USERNAME ?? "admin";
    const pw = process.env.POCKETBASE_ADMIN_PASSWORD ?? "admin";
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    pb.autoCancellation(false);
    await pb.collection("_superusers").authWithPassword(usr, pw);

    const isValid = pb.authStore.isValid;
    if (!isValid) {
      throw new Error(
        "Can not authorized with these credentials into PocketBase",
      );
    }
    return pb;
  }

  static Client(): PocketBase {
    return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  }

  get admin(): PocketBase {
    if (!this._admin) {
      throw new Error("PocketBaseService is not initialized yet.");
    }
    return this._admin;
  }
}

export const Client = () => {
  throw new Error("Should not import this.");
};
