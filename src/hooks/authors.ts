import pbClient from "@/client/pbClient";
import { Author, ListFetchingParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useAuthorsGetAllApi = ({
  search,
  page = 1,
  perPage = 5,
  filters,
}: ListFetchingParams) => {
  const filter = [
    ...(search ? [`name~'${search}'`] : []),
    // TODO: add category filter
  ].join(" & ");
  return useQuery({
    queryKey: ["author", search, page, perPage],
    queryFn: () =>
      pbClient.collection("authors").getList<Author>(0, 30, {
        filter,
        page,
        perPage,
        expand: "books,categories",
      }),
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
