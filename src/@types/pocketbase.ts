import type Client from "pocketbase";

export type Context = Record<string, any> & {
  pb: Client;
  admin: Client;
  params: {
    [key in string]: any;
  };
};
