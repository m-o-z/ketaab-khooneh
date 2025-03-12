import pbClient from "@/client/pbClient";
import { useCallback, useEffect } from "react";

const useAuthenticated = (onChange?: () => void) => {
  const handleAuthChanged = useCallback(() => {
    const cb = onChange || (() => {});
    pbClient.authStore.onChange(cb, true);
  }, []);

  useEffect(() => {
    handleAuthChanged();
  }, []);

  return pbClient.authStore.isValid;
};

export default useAuthenticated;
