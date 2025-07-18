import { subscriptions } from "@/client";
import { tick } from "@/utils/eventQueue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useBookAvailabilityIsSubscribedQuery = (bookId: string) => {
  return useQuery({
    ...subscriptions.book.availability.isSubscribed({ id: bookId }),
    select(response) {
      return response.data.isSubscribed;
    },
  });
};

const useSubscribeBookAvailabilityMutation = () => {
  return useMutation({
    ...subscriptions.book.availability.subscribe,
  });
};

const useUnsubscribeBookAvailabilityMutation = () => {
  return useMutation({
    ...subscriptions.book.availability.unsubscribe,
  });
};

export const useBookAvailability = (bookId: string) => {
  const queryClient = useQueryClient();
  const {
    data: isSubscribed,
    isLoading,
    isError,
    isSuccess,
  } = useBookAvailabilityIsSubscribedQuery(bookId);
  const { mutateAsync: mutateUnsubscribeAsync, isPending: isUnsubscribing } =
    useUnsubscribeBookAvailabilityMutation();
  const { mutateAsync: mutateSubscribeAsync, isPending: isSubscribing } =
    useSubscribeBookAvailabilityMutation();

  const showBookAvailabilitySubscriptionButton =
    !isLoading && isSuccess && !isError;

  const subscribe = () => {
    if (!showBookAvailabilitySubscriptionButton) {
      return;
    }

    return mutateSubscribeAsync(bookId);
  };

  const unsubscribe = () => {
    if (!showBookAvailabilitySubscriptionButton) {
      return;
    }

    return mutateUnsubscribeAsync(bookId);
  };

  const isPending = isSubscribing || isUnsubscribing;

  const toggleSubscription = async () => {
    if (!showBookAvailabilitySubscriptionButton || isPending) {
      return;
    }

    try {
      if (isSubscribed) {
        return unsubscribe();
      } else {
        return subscribe();
      }
    } finally {
      await tick();
      await tick();
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["-subscriptions-book-" + bookId + "-isSubscribed"],
      });
    }
  };

  return {
    isLoading,
    isSubscribed,
    isPending,
    showBookAvailabilitySubscriptionButton,
    subscribe,
    unsubscribe,
    toggleSubscription,
  };
};
