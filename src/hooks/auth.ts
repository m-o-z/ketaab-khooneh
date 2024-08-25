import { useMutation } from "react-query";
import pbClient from "@/client/pbClient";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { IconLogin } from "@tabler/icons-react";

export const useLoginApi = () => {
  const router = useRouter();
  return useMutation(
    ["auth", "login"],
    ({ email, password }: { email: string; password: string }) =>
      pbClient.collection("users").authWithPassword(email, password),
    {
      onError: (e: Error) => {
        notifications.show({
          message: e.message,
          color: "red",
        });
      },
      onSuccess: (authData) => {
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
          new URLSearchParams(window.location.search).get("next") || "/",
        );
      },
    },
  );
};

export const useLogoutApi = () => {
  const router = useRouter();
  return useMutation(
    ["auth", "logout"],
    async () => pbClient.authStore.clear(),
    {
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
    },
  );
};
