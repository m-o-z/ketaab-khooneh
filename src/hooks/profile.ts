import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export const useGetProfile = (): {isFetched: boolean, profile : User | null} => {
  const [isFetched, setIsFetched] = useState(false);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedProfile = JSON.parse(
      localStorage.getItem("_user_info") || "null",
    );
    if (storedProfile) {
      setProfile(storedProfile);
      setIsFetched(true)
    } else {
      router.push("/login?next=/profile");
    }
  }, []);

  return {
    isFetched,
    profile
  };
};
