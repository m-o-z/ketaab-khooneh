import { ListResult } from "pocketbase";

export type PageMeta = Omit<ListResult<any>, "items">;
export const extractPagedMeta = <T>(result: ListResult<T>): PageMeta => {
  const { items: _, ...response } = result;
  return response;
};
