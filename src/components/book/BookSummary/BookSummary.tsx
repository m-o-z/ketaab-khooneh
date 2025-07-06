import { Box, Flex, Stack } from "@mantine/core";
import { IconBooks, IconTag } from "@tabler/icons-react";
import { Badge } from "@tapsioss/react-components";
import { Calendar, PencilLine } from "@tapsioss/react-icons";
import dayjs from "dayjs";

import AuthorPreview from "@/components/author/AuthorPreview";
import BookPreview from "@/components/book/BookPreview";
import { BookDTO } from "@/schema/books";
import { Book } from "@/types";

type Props = {
  book: BookDTO;
};
const BookSummary = ({ book }: Props) => {
  const renderEdition = () => {
    if (book.edition) {
      return (
        <Badge
          color={"info"}
          priority="low"
          size="sm"
          value={`ویرایش ${book.edition}`}
        />
      );
    }
  };
  const renderCount = () => {
    return (
      <Flex align="center" columnGap="xs">
        <Box
          h={24}
          style={(theme) => ({
            color: theme.colors.gray[6],
          })}
          w={24}
        >
          <IconBooks />
        </Box>
        <label>تعداد</label>
        <p>{book.availableCount}</p>
      </Flex>
    );
  };
  const renderCategories = () => {
    return (
      <Flex align="center" columnGap="xs">
        <Box
          h={24}
          style={(theme) => ({
            color: theme.colors.gray[6],
          })}
          w={24}
        >
          <IconTag size={"24px"} />
        </Box>
        <label>دسته‌بندی</label>
        {book.categories.map((item) => (
          <Badge key={item.label} color="info" value={item.label} />
        ))}
      </Flex>
    );
  };
  const renderReleaseDate = () => {
    return (
      <Flex align="center" columnGap="xs">
        <Box
          h={24}
          style={(theme) => ({
            color: theme.colors.gray[6],
          })}
          w={24}
        >
          <Calendar />
        </Box>
        <label>تاریخ انتشار</label>
        <p>{dayjs(book.releaseYear).format("YYYY")}</p>
      </Flex>
    );
  };
  const renderAuthors = () => {
    return (
      <Flex columnGap="xs" wrap="wrap">
        <Box
          h={24}
          style={(theme) => ({
            color: theme.colors.gray[6],
          })}
          w={24}
        >
          <PencilLine />
        </Box>
        {book.authors.map((author) => (
          <AuthorPreview.Compact key={author.id} author={author} />
        ))}
      </Flex>
    );
  };
  return (
    <Stack>
      <BookPreview hideBottomTexts book={book} height="auto" width="14rem" />
      <Flex align="flex-start" direction="column" gap="md" w="100%">
        {renderEdition()}
        {renderCount()}
        {renderCategories()}
        {renderReleaseDate()}
        {renderAuthors()}
      </Flex>
      <p>{book.description}</p>
    </Stack>
  );
};

export default BookSummary;
