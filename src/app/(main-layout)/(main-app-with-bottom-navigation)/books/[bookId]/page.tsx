"use client";
import {
  Alert,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconShoppingCartExclamation,
} from "@tabler/icons-react";
import {
  Button,
  ButtonSlots,
  Notice,
  NoticeSlots,
} from "@tapsioss/react-components";
import { ShoppingCart } from "@tapsioss/react-icons";
import { useParams, useRouter } from "next/navigation";

import BookSummary from "@/components/book/BookSummary/BookSummary";
import UserPreview from "@/components/user/UserPreview";
import { useBooksGetApi } from "@/hooks/books";
import { PageLayout } from "@/providers/PageLayout";
import { detectTextLanguage } from "@/utils/text";

// TODO: fix style
const Page = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { bookId } = useParams();
  const {
    isLoading,
    data: book,
    isSuccess,
    isError,
    refetch,
  } = useBooksGetApi(bookId as string);

  const renderActionArea = () => {
    if (book?.status === "BORROWED") {
      return book.borrowedBy ? (
        <Alert color="gray" icon={<IconShoppingCartExclamation />}>
          <Flex align="center" gap="sm">
            <Text>This book is currently borrowed by</Text>
            <UserPreview color={theme.colors.gray[5]} user={book.borrowedBy} />
          </Flex>
        </Alert>
      ) : null;
    }
    if (book?.status === "RESERVED_BY_ME") {
      return (
        <>
          <Notice
            visible
            description="این کتاب توسط شما رزرو شده است."
            priority="low"
          >
            <div slot={NoticeSlots.ACTION}>
              <Button color="red">لغو رزرو</Button>
            </div>
          </Notice>
          <Alert color="blue" icon={<IconShoppingCart />}>
            <Stack gap="sm">
              <Text>This book is currently reserved by you</Text>
              <div>
                <Button variant="destructive">Cancel Reservation</Button>
              </div>
            </Stack>
          </Alert>
        </>
      );
    }
    if (book?.status === "RESERVED_BY_OTHERS") {
      return book.reservedBy ? (
        <Alert color="yellow.8">
          <Flex gap="sm">
            <Text>This book is currently reserved by</Text>
            <UserPreview user={book.reservedBy} />
          </Flex>
        </Alert>
      ) : null;
    }
    if (book?.status === "UNAVAILABLE") {
      return (
        <Notice
          visible
          color="error"
          description="این کتاب در حال حاضر در دسترس نیست."
          priority="low"
        />
      );
    }
    if (book?.status === "AVAILABLE") {
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
        {renderActionArea()}
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
      isError={isError}
      isLoading={isLoading}
      noContent={!book && isSuccess}
      retry={() => {
        void refetch();
      }}
      onBackClick={onBackClick}
    >
      {book ? renderBookDetail() : null}
    </PageLayout>
  );
};

export default Page;
