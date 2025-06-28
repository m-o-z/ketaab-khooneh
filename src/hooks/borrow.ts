import { borrows } from "@/client";
import { useQuery } from "@tanstack/react-query";

export const useGetAllBorrows = () => {
  return useQuery({
    ...borrows.getAll(),
    select(response) {
      if (response.status === "OK") {
        return response.data;
      }
      return response;
    },
  });
};
