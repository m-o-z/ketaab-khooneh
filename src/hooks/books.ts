import pbClient from "@/client/pbClient";
import { books } from "../client";
import { useQuery } from "@tanstack/react-query";
import { Book, ListFetchingParams } from "@/types";
import { useMemo } from "react";

export const useBooksGetAllApi = ({
  search,
  page = 1,
  perPage = 5,
}: ListFetchingParams) => {
  const filter = useMemo(
    () =>
      [
        ...(search ? [`title~'${search}'`] : []),
        // TODO: add category filter
      ].join(" & "),
    [search],
  );
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
