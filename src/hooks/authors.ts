import { useQuery } from "@tanstack/react-query";

import { authors } from "@/client";
import { Author, AuthorListFetchingParams } from "@/types";

export const useAuthorsGetAllApi = ({
  search,
  page = 1,
  perPage = 5,
}: AuthorListFetchingParams) => {
  const filter = [...(search ? [`name~'${search}'`] : [])].join(" & ");
  return useQuery({
    ...authors.getAll({
      filter,
      page,
      perPage,
    }),
    select(result) {
      if ("data" in result) {
        return result.data;
      }
      return result;
    },
  });
};

export const useAuthorGetApi = (authorId: Author["id"]) => {
  return useQuery({
    ...authors.getById(authorId)(),
    select(result) {
      if ("data" in result) {
        return result.data;
      }
      return result;
    },
  });
};
