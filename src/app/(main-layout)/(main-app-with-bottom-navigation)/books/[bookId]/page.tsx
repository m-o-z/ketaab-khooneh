"use client";
import Spinner from "@/common/Spinner/Spinner";
import BookSummary from "@/components/book/BookSummary/BookSummary";
import ErrorSection from "@/components/ErrorSection";
import NotFound from "@/components/NotFound";
import UserPreview from "@/components/user/UserPreview";
import { useBooksGetApi } from "@/hooks/books";
import { PageLayout } from "@/providers/PageLayout";
import { detectTextLanguage } from "@/utils/text";
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

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <ErrorSection refetch={refetch} />;
  }

  if (!book && isSuccess) {
    <NotFound />;
  }

  const renderActionArea = () => {
    if (book?.status === "BORROWED") {
      return (
        book.borrowedBy && (
          <Alert color="gray" icon={<IconShoppingCartExclamation />}>
            <Flex gap="sm" align="center">
              <Text>This book is currently borrowed by</Text>
              <UserPreview
                user={book.borrowedBy}
                color={theme.colors.gray[5]}
              />
            </Flex>
          </Alert>
        )
      );
    }
    if (book?.status === "RESERVED_BY_ME") {
      return (
        <>
          <Notice
            priority="low"
            visible
            description="این کتاب توسط شما رزرو شده است."
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
      return (
        book.reservedBy && (
          <Alert color="yellow.8">
            <Flex gap="sm">
              <Text>This book is currently reserved by</Text>
              <UserPreview
                user={book.reservedBy}
                color={theme.colors.yellow[9]}
              />
            </Flex>
          </Alert>
        )
      );
    }
    if (book?.status === "UNAVAILABLE") {
      return (
        <Notice
          visible
          color="error"
          priority="low"
          description="این کتاب در حال حاضر در دسترس نیست."
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
        <Title order={3} className="text-right" dir="rtl">
          {title}
        </Title>
      );
    } else {
      return (
        <Title order={3} className="text-left" dir="ltr">
          {title}
        </Title>
      );
    }
  };

  const renderBookDetail = () => {
    if (isLoading) return "loading";
    if (isError)
      return <ErrorSection description="خطایی در نمایش این کتاب رخ داد" />;
    if (!book) return <ErrorSection description="اطلاعات کتاب یافت نشد:(" />;
    return (
      <div className="space-y-8">
        <div>{renderBookTitle(book.title)}</div>
        <BookSummary book={book} />
        {renderActionArea()}
      </div>
    );
  };

  const onBackClick = () => {
    router.back();
  };

  return (
    <PageLayout
      initialTitle="جزئیات کتاب"
      showBackButton
      onBackClick={onBackClick}
    >
      {renderBookDetail()}
    </PageLayout>
  );
};

export default Page;
