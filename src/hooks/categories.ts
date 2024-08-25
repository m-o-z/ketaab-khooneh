import pbClient from "@/client/pbClient";
import { BookCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useCategoriesQuery = () =>
  useQuery({ queryKey: ["categories-list"], queryFn: () => pbClient.collection("categories").getFullList<BookCategory>()});
