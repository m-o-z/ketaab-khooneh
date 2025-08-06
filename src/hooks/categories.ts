import { useMutation, useQuery } from "@tanstack/react-query";

import { categories } from "@/client";

export const useCategoriesQuery = ({ enabled }: { enabled: boolean }) =>
  useQuery({
    ...categories.getAll(),
    enabled,
    select(response) {
      if ("data" in response) {
        return response.data;
      }
      return response;
    },
    retry: 2,
  });
