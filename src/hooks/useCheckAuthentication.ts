import pbClient from "@/client/pbClient";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const useCheckAuthentication = (onChange?: () => void) => {
  const pb = useRef(pbClient());
  const navigate = useRouter();

  const handleAuthChanged = useCallback(() => {
    const cb = onChange || (() => {});
    pb.current.authStore.onChange(cb, true);
  }, []);

  useEffect(() => {
    handleAuthChanged();
  }, []);

  const isAuthenticated = pb.current.authStore.isValid;

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      navigate.replace("/login");
    }
  }, []);
};

export default useCheckAuthentication;
