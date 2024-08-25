import pbClient from "@/client/pbClient";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@/types";

export const useBooksGetAllApi = () =>
  useQuery({ queryKey: ["book"], queryFn: () => pbClient.collection("books").getList<Book>(0, 30,{
    expand: 'authors,categories'
  })});

export const useBooksGetApi = (bookId: Book["id"]) =>
  useQuery({ queryKey: ["book", bookId], queryFn: () => pbClient.collection("books").getOne<Book>(bookId, {
    expand: 'authors,categories'
  })});
