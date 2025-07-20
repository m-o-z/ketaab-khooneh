import { subscriptions } from "@/client";
import { tick } from "@/utils/eventQueue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
  const [isInvalidating, setIsInvalidating] = useState(false);
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

  const isPending = isSubscribing || isUnsubscribing || isInvalidating;

  const toggleSubscription = async () => {
    setIsInvalidating(true);
    if (!showBookAvailabilitySubscriptionButton || isPending) {
      return;
    }

    try {
      if (isSubscribed) {
        return await unsubscribe();
      } else {
        return await subscribe();
      }
    } finally {
      await tick();
      await tick();
      await queryClient.invalidateQueries({
        queryKey: ["-subscriptions-book-" + bookId + "-isSubscribed"],
      });
      setIsInvalidating(false);
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
