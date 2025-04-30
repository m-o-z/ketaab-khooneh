import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { users } from "@/client";
import pbClient from "@/client/pbClient";

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
