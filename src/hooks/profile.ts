import { useQuery } from "@tanstack/react-query";

import { users } from "@/client";

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
