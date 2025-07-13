"use client";
import { Flex, Title } from "@mantine/core";
import {
  Button,
  ButtonSlots,
  IconButton,
  Notice,
  NoticeSlots,
} from "@tapsioss/react-components";
import { ArrowLeft, ShoppingCart } from "@tapsioss/react-icons";
import { useParams, useRouter } from "next/navigation";

import BookSummary from "@/components/book/BookSummary/BookSummary";
import { useBooksGetApi } from "@/hooks/books";
import { useGetProfile } from "@/hooks/profile";
import { PageLayout } from "@/providers/PageLayout";
import { detectTextLanguage } from "@/utils/text";

// TODO: fix style
const Page = () => {
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: profileRefetch,
  } = useGetProfile();
  const router = useRouter();
  const { bookId } = useParams();
  const {
    isLoading,
    data: book,
    isSuccess,
    isError,
    refetch,
  } = useBooksGetApi(bookId as string);

  const renderActionArea = () => {
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
            <Button href={"/borrows/"}>
              <div>برو به امانت‌ها</div>
              <ArrowLeft slot={ButtonSlots.TRAILING_ICON} />
            </Button>
          </div>
        </Notice>
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
            <Button href={"/borrows/" + book.activeBorrow.id}>جزئیات</Button>
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
          description="این کتاب در حال حاضر در دسترس نیست."
          priority="low"
        />
      );
    }
    if (book?.status === "AVAILABLE" && book.availableCount > 0) {
      return (
        <Flex justify={"end"}>
          <Button>
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

  const renderBookDetail = () => {
    return (
      <div className="space-y-8">
        <div>{renderBookTitle(book!.title)}</div>
        <BookSummary book={book!} />
        <div>{renderActionArea()}</div>
      </div>
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
      isLoading={isLoading || isProfileLoading}
      noContent={!book && isSuccess}
      retry={() => {
        void profileRefetch();
        void refetch();
      }}
      onBackClick={onBackClick}
    >
      {book ? renderBookDetail() : null}
    </PageLayout>
  );
};

export default Page;
