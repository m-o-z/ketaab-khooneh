import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      gcTime: 1000 * 60 * 15,
      staleTime: 1000 * 60 * 10,
      retry: 3,
    },
  },
});
