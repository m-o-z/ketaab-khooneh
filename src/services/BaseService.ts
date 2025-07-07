import Client from "pocketbase";

import { PocketBaseService } from "./PocketBaseService";

export class BaseService {
  protected static _instance: BaseService = null!;
  protected _adminClient: () => Promise<Client> = null!;

  protected constructor() {
    this._adminClient = async () => await PocketBaseService.AdminClient();
  }

  public static GetInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new this();
    return this._instance;
  }
}
