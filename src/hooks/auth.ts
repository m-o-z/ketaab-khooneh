import { api, auth } from "@/client";
import pbClient from "@/client/pbClient";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
    onSuccess: (authData) => {
      console.log({ authData });
      notifications.show({
        message: "Logged in Successfully",
        color: "green",
      });
      const { avatar, created, email, id, name, username, verified } =
        authData.record;
      const userData = {
        avatar,
        created,
        email,
        id,
        name,
        username,
        verified,
      };
      localStorage.setItem("_user_info", JSON.stringify(userData));
      localStorage.setItem("_token", authData.token);
      router.push(
        new URLSearchParams(window.location.search).get("next") || "/book",
      );
    },
  });
};

export const useLogoutApi = () => {
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
      localStorage.removeItem("_user_info");
      localStorage.removeItem("_token");
      notifications.show({
        message: "Logged out Successfully",
        color: "green",
      });
      router.push("/login");
    },
  });
};
