import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { Book, BookListFetchingParams } from "@/types";

import { books } from "../client";
import { createExpression } from "../../backend/util/queryFilters";

export const useBooksGetAllApi = ({
  search,
  page = 1,
  perPage = 5,
  categories = [],
  status,
  language = [],
}: BookListFetchingParams) => {
  const filter = useMemo(
    () =>
      [
        ...createExpression(!!search, [
          `bookWork.title:lower ~ '${search!.toLowerCase()}' || bookWork.authors.name:lower ?~ '${search!.toLowerCase()}'`,
        ]),
        ...createExpression(
          categories.length > 0,
          categories.map((item) => `bookWork.categories.slug ?= '${item}'`),
          " || ",
        ),
        ...createExpression(!!status, [`status = '${status}'`]),
        ...createExpression(
          language.length > 0,
          language.map((item) => `language ?= '${item}'`),
          " || ",
        ),
        // TODO: add category filter
      ].join(" && "),
    [search, page, perPage, categories, status, language],
  );
  console.log({ filter });
  return useQuery({
    ...books.getAll({
      page,
      perPage,
      filter,
    }),
    select(result) {
      return result.data;
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
