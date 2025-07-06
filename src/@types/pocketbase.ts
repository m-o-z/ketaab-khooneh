import type Client from "pocketbase";

import { UserCore, UserDB } from "@/schema/users";

export type Context = Record<string, any> & {
  pb: Client;
  admin: Client;
  user?: UserCore;
  user_db?: UserDB;
  params: {
    [key in string]: any;
  };
};

export type AuthorizedContext = Required<Context>;

export type ListQueryPageOptions = {
  page: number;
  perPage: number;
};
