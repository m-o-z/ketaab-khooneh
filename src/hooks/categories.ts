import { useQuery } from "@tanstack/react-query";

import { categories } from "@/client";

export const useCategoriesQuery = () =>
  useQuery({
    ...categories.getAll(),
    select(data) {
      return data.data;
    },
  });
