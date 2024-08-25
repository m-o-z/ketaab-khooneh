import pbClient from "@/client/pbClient";
import { useQuery } from "react-query";
import { Book } from "@/types";

export const useBooksGetAllApi = () =>
  useQuery(["book"], () => pbClient.collection("books").getFullList());

export const useBooksGetApi = (bookId: Book["id"]) =>
  useQuery(["book", bookId], () => pbClient.collection("books").getOne(bookId));
