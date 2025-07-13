import { UserCoreSchema, UserDB } from "@/schema/users";

import { BaseService } from "./BaseService";

class UserService extends BaseService {
  public async getUser(userId: string) {
    const client = await this._adminClient();
    const userDB = await client.collection<UserDB>("users").getOne(userId, {
      expand: "borrows_via_user",
    });

    const userCore = UserCoreSchema.parse(userDB);
    return userCore;
  }

  public async getUserWithBorrows(userId: string) {
    const client = await this._adminClient();
    const userDB = await client.collection<UserDB>("users").getOne(userId, {
      expand: "borrows_via_user,borrows_via_user.book",
    });
    const userCore = UserCoreSchema.parse(userDB);
    return userCore;
  }
}

const instance = UserService.GetInstance() as UserService;

export default instance;
