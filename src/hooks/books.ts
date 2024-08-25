import pbClient from "@/client/pbClient";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@/types";

export const useBooksGetAllApi = () =>
  useQuery({ queryKey: ["book"], queryFn: () => pbClient.collection("books").getList(0, 30,{
    expand: 'author'
  })});

export const useBooksGetApi = (bookId: Book["id"]) =>
  useQuery({ queryKey: ["book", bookId], queryFn: () => pbClient.collection("books").getOne(bookId, {
    expand: 'author'
  })});
