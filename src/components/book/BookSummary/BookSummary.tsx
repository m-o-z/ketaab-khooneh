import React from 'react';
import BookPreview from "@/components/book/BookPreview";
import {Badge, Flex, Stack, Text, Title} from "@mantine/core";
import {IconBooks, IconCalendarMonth, IconFeather, IconTag} from "@tabler/icons-react";
import AuthorPreview from "@/components/author/AuthorPreview/AuthorPreview";
import {Book} from "@/types";

type Props = {
    book: Book
}
const BookSummary = ({book}: Props) => {

    return (
        <>
            <BookPreview book={book} hideBottomTexts/>
            <Flex direction="column" gap="md" align="flex-start" w="100%">
                <Flex gap="sm" align="center">
                    <Title order={2}>{book.title}</Title>
                    {book.edition && <Badge color="cyan">Edition {book.edition}</Badge>}
                </Flex>
                <Flex gap="sm">
                    <IconBooks/>
                    <Text>Count: {book.count}</Text>
                </Flex>
                <Flex gap="sm">
                    <IconTag />
                    <Text>Category: {book.category}</Text>
                </Flex>
                <Flex gap="sm">
                    <IconCalendarMonth/>
                    <Text>Release Year: {book.releaseYear}</Text>
                </Flex>
                <Flex wrap="wrap" gap="sm">
                    <IconFeather/>
                    {book.authors.map((author) => (
                        <AuthorPreview key={author.id} author={author}/>
                    ))}
                </Flex>
            </Flex>
            <Text>{book.description}</Text>
        </>
    );
};

export default BookSummary;