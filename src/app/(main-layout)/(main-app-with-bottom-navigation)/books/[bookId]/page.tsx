"use client";
import { Flex, Title } from "@mantine/core";
import {
  Button,
  ButtonSlots,
  Notice,
  NoticeSlots,
} from "@tapsioss/react-components";
import { ArrowLeft, ShoppingCart } from "@tapsioss/react-icons";
import { useParams, useRouter } from "next/navigation";

import BookSummary from "@/components/book/BookSummary/BookSummary";
import { useBooksGetApi } from "@/hooks/books";
import { useBorrowBookMutation } from "@/hooks/borrow";
import { useGetProfile } from "@/hooks/profile";
import { useBookAvailability } from "@/hooks/subscriptions";
import { PageLayout } from "@/providers/PageLayout";
import { toStandardJalaliDateTime } from "@/utils/prettifyDate";
import { detectTextLanguage } from "@/utils/text";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import z from "zod";

// TODO: fix style
const Page = () => {
  const queryClient = useQueryClient();
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    isFetched: isProfileFetched,
    refetch: profileRefetch,
  } = useGetProfile();
  const { mutateAsync: borrowBookMutateAsync, isPending } =
    useBorrowBookMutation();

  const router = useRouter();
  const { bookId } = useParams();

  const {
    isPending: isBookSubscriptionPending,
    isLoading: isBookSubscriptionLoading,
    isSubscribed,
    toggleSubscription,
  } = useBookAvailability(z.string().parse(bookId));

  const {
    isLoading,
    isFetched,
    data: book,
    isSuccess,
    isError,
    refetch,
  } = useBooksGetApi(bookId as string);

  const onGoBorrowsPage = () => {
    router.push("/borrows");
  };

  const onBorrowBook = async (bookId: string) => {
    try {
      const result = await borrowBookMutateAsync(bookId);
      notifications.show({
        message: "امانت‌گیری کتاب با موفقیت ثبت شد!",
        color: "green",
      });

      queryClient.invalidateQueries({});
    } catch (err: any) {
      console.log({ err });
      if ("message" in err) {
        notifications.show({
          title: "خطا در رزرو!",
          message: err.message,
          color: "red",
        });
      }
    }
  };
  const renderActionArea = () => {
    if (userProfile?.isPunished) {
      const dateString = toStandardJalaliDateTime(
        dayjs(userProfile.punishmentEndAt),
      );
      const description = `
      شما تا تاریخ 
      ${dateString}
      امکانت امانت گیری کتاب‌ها را نخواهید داشت
      `;
      return (
        <Notice
          visible
          className="w-full"
          color="error"
          heading="شما جریمه شدید"
          description={description}
          priority="high"
        ></Notice>
      );
    }
    if (book?.activeBorrow) {
      return (
        <Notice
          visible
          className="w-full"
          color="info"
          description="این کتاب را قبلا امانت گرفته‌اید"
          priority="low"
        >
          <div slot={NoticeSlots.ACTION} className="flex content-end w-full">
            <Button
              onClick={() => {
                router.push("/borrows");
              }}
            >
              جزئیات
            </Button>
          </div>
        </Notice>
      );
    }

    if (book?.status === "UNAVAILABLE") {
      return (
        <Notice
          visible
          className="w-full"
          color="error"
          heading="این کتاب در حال حاضر در دسترس نیست."
          description="برای اطلاع از لحظه در دسترس قرار گرفتن، می‌توانید از دکمه زیر استفاده کنید."
          priority="low"
        >
          <div slot={NoticeSlots.ACTION} className="w-full justify-end flex">
            <Button
              loading={isBookSubscriptionLoading || isBookSubscriptionPending}
              disabled={isBookSubscriptionLoading || isBookSubscriptionPending}
              onClick={toggleSubscription}
            >
              {isSubscribed
                ? "غیرفعال‌سازی اطلاع‌رسانی"
                : "فعال‌سازی اطلاع‌رسانی"}
            </Button>
          </div>
        </Notice>
      );
    }

    if (userProfile?.activeBorrowsCount) {
      return (
        <Notice
          visible
          className="w-full"
          color="warning"
          description="شما به سقف تعداد امانت‌گیری رسیدید!"
          priority="low"
        >
          <div slot={NoticeSlots.ACTION} className="flex content-end w-full">
            <Button onClick={() => onGoBorrowsPage()}>
              <div>برو به امانت‌ها</div>
              <ArrowLeft slot={ButtonSlots.TRAILING_ICON} />
            </Button>
          </div>
        </Notice>
      );
    }
    if (book?.status === "AVAILABLE" && book.availableCount > 0) {
      return (
        <Flex justify={"end"}>
          <Button onClick={() => onBorrowBook(book.id)} loading={isPending}>
            <ShoppingCart slot={ButtonSlots.TRAILING_ICON} />
            امانت بگیر
          </Button>
        </Flex>
      );
    }
  };

  const renderBookTitle = (title: string) => {
    const language = detectTextLanguage(title);

    if (language === "persian") {
      return (
        <Title className="text-right" dir="rtl" order={3}>
          {title}
        </Title>
      );
    }
    return (
      <Title className="text-left" dir="ltr" order={3}>
        {title}
      </Title>
    );
  };

  const onBackClick = () => {
    router.back();
  };

  return (
    <PageLayout
      showBackButton
      initialTitle="جزئیات کتاب"
      isError={isError || isProfileError}
      isInitialLoading={
        (isLoading || isProfileLoading) && !isFetched && !isProfileFetched
      }
      noContent={!book && isSuccess}
      retry={() => {
        void profileRefetch();
        void refetch();
      }}
      onBackClick={onBackClick}
    >
      <PageLayout.Content>
        {book && (
          <div className="space-y-8">
            <div>{renderBookTitle(book!.title)}</div>
            <BookSummary book={book!} />
            <div>{renderActionArea()}</div>
          </div>
        )}
      </PageLayout.Content>
    </PageLayout>
  );
};

export default Page;
