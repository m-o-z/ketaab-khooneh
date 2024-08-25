import pbClient from "@/client/pbClient";
import { Author, Book, BookCategory, ListFetchingParams } from "@/types";
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
      pbClient.collection("authors").getFullList<Author>({
        filter,
        page,
        perPage,
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
