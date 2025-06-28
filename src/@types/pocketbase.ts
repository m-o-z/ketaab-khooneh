import type pbClient from "@/client/pbClient";

export type Context = Record<string, any> & {
  pb: ReturnType<typeof pbClient>;
  params: {
    [key in string]: any;
  };
};
