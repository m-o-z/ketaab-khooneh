import pbClient from "@/client/pbClient";
import { books } from "../client";
import { useQuery } from "@tanstack/react-query";
import { Book, ListFetchingParams } from "@/types";

export const useBooksGetAllApi = ({
  search,
  page = 1,
  perPage = 5,
  filters,
}: ListFetchingParams) => {
  const filter = [
    ...(search ? [`title~'${search}'`] : []),
    // TODO: add category filter
  ].join(" & ");
  return useQuery({
    ...books.getAll({
      page,
      perPage,
      filter,
    }),
    select(result) {
      if ("data" in result) {
        return result.data;
      }
      return result;
    },
  });
};

export const useBooksGetApi = (bookId: Book["id"]) =>
  useQuery({
    ...books.getById(bookId)(),
    enabled: bookId !== undefined,
    select(response) {
      if ("data" in response) {
        return response.data;
      }
      return response;
    },
  });
