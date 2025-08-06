import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { auth } from "@/client";

type RequestPayload = {
  email: string;
  password: string;
};

export const useLoginApi = () => {
  const router = useRouter();
  return useMutation({
    ...auth.login,
    onError: (e: Error) => {
      notifications.show({
        message: e.message,
        color: "red",
      });
    },
    onSuccess: (response) => {
      if (response.otpId) {
        let url = "/auth/verify/" + response.otpId;
        if (response.email) {
          url += "?email=" + response.email;
        }
        router.push(url);
      } else {
        alert("error");
      }
    },
  });
};

export const useVerifyApi = () => {
  const router = useRouter();
  return useMutation({
    ...auth.verify,
    onError: (e: Error) => {
      notifications.show({
        message: e.message,
        color: "red",
      });
    },
    onSuccess: (response) => {
      const { isProfileCompleted } = response.record;
      if (!isProfileCompleted) {
        router.push("/profile");
        return;
      }
      router.push(
        new URLSearchParams(window.location.search).get("next") || "/books",
      );
    },
  });
};

export const useLogoutApi = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    ...auth.logout,
    onError: (e: Error) => {
      notifications.show({
        message: e.message,
        color: "red",
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({});
      localStorage.removeItem("_user_info");
      localStorage.removeItem("_token");
      notifications.show({
        message: "Logged out Successfully",
        color: "green",
      });
      router.push("/auth/login");
    },
  });
};
