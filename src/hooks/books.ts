import pbClient from "@/client/pbClient";
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
    queryKey: ["book", search, page, perPage],
    queryFn: () =>
      pbClient.collection("books").getList<Book>(0, 30, {
        filter,
        page,
        perPage,
        expand: "authors,categories",
      }),
  });
};

export const useBooksGetApi = (bookId: Book["id"]) =>
  useQuery({
    queryKey: ["book", bookId],
    queryFn: () =>
      pbClient.collection("books").getOne<Book>(bookId, {
        expand: "authors,categories",
      }),
  });
