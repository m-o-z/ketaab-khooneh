import { users } from "@/client";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = () => {
  return useQuery({
    ...users.me(),
    select(result) {
      if ("data" in result) {
        return result.data;
      }
      return result;
    },
  });
};
