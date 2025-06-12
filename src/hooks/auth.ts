import { auth } from "@/client";
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
    onSuccess: (response) => {
      if (response.otpId) {
        console.log({ id: response.otpId });
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
  console.log("here");
  return useMutation({
    ...auth.verify,
    onError: (e: Error) => {
      notifications.show({
        message: e.message,
        color: "red",
      });
    },
    onSuccess: (response) => {
      const {
        avatar,
        created,
        email,
        id,
        verified,
        firstName,
        lastName,
        isPunished,
      } = response.record;
      const userData = {
        avatar,
        created,
        email,
        id,
        firstName,
        lastName,
        isPunished,
        verified,
      };
      localStorage.setItem("_user_info", JSON.stringify(userData));
      router.push(
        new URLSearchParams(window.location.search).get("next") || "/books",
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
      router.push("/auth/login");
    },
  });
};
