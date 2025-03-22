import pbClient from "@/client/pbClient";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

const useCheckAuthentication = (onChange?: () => void) => {
  const navigate = useRouter();

  const handleAuthChanged = useCallback(() => {
    const cb = onChange || (() => {});
    pbClient.authStore.onChange(cb, true);
  }, []);

  useEffect(() => {
    handleAuthChanged();
  }, []);

  const isAuthenticated = pbClient.authStore.isValid;

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      navigate.replace("/login");
    }
  }, []);
};

export default useCheckAuthentication;
