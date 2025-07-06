import { useQuery } from "@tanstack/react-query";

import { borrows } from "@/client";

export const useGetAllBorrowsQuery = () => {
  return useQuery({
    ...borrows.getAll(),
    select(response) {
      return response.data;
    },
  });
};

export const useGetAllPreviousBorrowsQuery = () => {
  return useQuery({
    ...borrows.getAllPrevious(),
    select(response) {
      return response.data;
    },
  });
};
