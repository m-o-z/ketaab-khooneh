import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export const useGetProfile = (): User | null => {
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const storedProfile = JSON.parse(
      localStorage.getItem("_user_info") || "null",
    );
    if (storedProfile) {
      setProfile(storedProfile);
    } else {
      router.push("/login?next=/profile");
    }
  }, []);
  return profile;
};
