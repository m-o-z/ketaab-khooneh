import { categories } from "@/client";
import { useQuery } from "@tanstack/react-query";

export const useCategoriesQuery = () =>
  useQuery({
    ...categories.getAll(),
    select(data) {
      return data.data;
    },
  });
