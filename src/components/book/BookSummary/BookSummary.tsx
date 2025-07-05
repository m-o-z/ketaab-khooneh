import AuthorPreview from "@/components/author/AuthorPreview";
import BookPreview from "@/components/book/BookPreview";
import { Book } from "@/types";
import { Box, Flex, Stack } from "@mantine/core";
import { Badge } from "@tapsioss/react-components";
import { IconBooks, IconTag } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Calendar, PencilLine } from "@tapsioss/react-icons";
import { BookDTO } from "@/schema/books";

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
      <Flex columnGap="xs" align="center">
        <Box
          style={(theme) => ({
            color: theme.colors.gray[6],
          })}
          h={24}
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
      <Flex columnGap="xs" align="center">
        <Box
          style={(theme) => ({
            color: theme.colors.gray[6],
          })}
          h={24}
          w={24}
        >
          <IconTag size={"24px"} />
        </Box>
        <label>دسته‌بندی</label>
        {book.categories.map((item) => (
          <Badge key={item.label} value={item.label} color="info" />
        ))}
      </Flex>
    );
  };
  const renderReleaseDate = () => {
    return (
      <Flex columnGap="xs" align="center">
        <Box
          style={(theme) => ({
            color: theme.colors.gray[6],
          })}
          h={24}
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
          style={(theme) => ({
            color: theme.colors.gray[6],
          })}
          h={24}
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
      <BookPreview book={book} hideBottomTexts width="14rem" height="auto" />
      <Flex direction="column" gap="md" align="flex-start" w="100%">
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
