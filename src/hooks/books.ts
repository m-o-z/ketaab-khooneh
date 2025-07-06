import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { Book, ListFetchingParams } from "@/types";

import { books } from "../client";

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
