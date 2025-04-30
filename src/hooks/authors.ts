import { authors } from "@/client";
import pbClient from "@/client/pbClient";
import { Author, ListFetchingParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useAuthorsGetAllApi = ({
  search,
  page = 1,
  perPage = 5,
  filters,
}: ListFetchingParams) => {
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

export const useAuthorGetApi = (authorId: Author["id"]) =>
  useQuery({
    queryKey: ["author", authorId],
    queryFn: () =>
      pbClient.collection("authors").getOne<Author>(authorId, {
        expand: "books,categories",
      }),
  });
