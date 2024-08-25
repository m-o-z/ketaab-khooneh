import pbClient from "@/client/pbClient";
import { Author, Book, BookCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useAuthorsGetAllApi = () =>
  useQuery({
    queryKey: ["author"],
    queryFn: () => pbClient.collection("authors").getFullList<Author>(),
  });

export const useAuthorGetApi = (authorId: Author["id"]) =>
  useQuery({
    queryKey: ["author", authorId],
    queryFn: () =>
      pbClient.collection("authors").getOne<Author>(authorId, {
        expand: "books,categories",
      }),
  });
