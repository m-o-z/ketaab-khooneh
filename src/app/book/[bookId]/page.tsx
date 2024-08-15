'use client'
import React from 'react';
import {useParams} from "next/navigation";
import {books} from "@/mock";
import BookPreview from "@/components/book/BookPreview";
import {Box, Button, Flex, Stack, Text, Title} from "@mantine/core";
import AuthorPreview from "@/components/author/AuthorPreview/AuthorPreview";
import UserPreview from "@/components/user/UserPreview/UserPreview";

// TODO: fix style
const Page = () => {
    const {bookId} = useParams();
    const book = books.find(book => book.id === bookId)

    const renderActionArea = () => {
        if (book?.status === "BORROWED") {
            return book.borrowedBy && (
                <Text>This book is currently borrowed by <span><UserPreview user={book.borrowedBy}/></span></Text>
            )
        }
        if (book?.status === "RESERVED_BY_ME") {
            return (
                <Stack>
                    <Text c="blue">This book is currently borrowed by You</Text>
                    <Button color="red" fullWidth>Cancel Reservation</Button>
                </Stack>
            )
        }
        if (book?.status === "RESERVED_BY_OTHERS") {
            return book.reservedBy && (
                <Text c="yellow">This book is currently reserved by <span><UserPreview user={book.reservedBy}/></span></Text>
            )
        }
        if (book?.status === "AVAILABLE") {
            return <Button color="green" fullWidth>Borrow the Book!</Button>
        }
        if (book?.status === "NOT_AVAILABLE") {
            return <Text c="red">This book is not available right now</Text>
        }
    }
    return (
        <Box maw={768} mx="auto">
            {book && (
                <Stack gap="md" w="100%">
                    <BookPreview book={book} hideBottomTexts/>
                    <Flex direction="column" gap="md" align="flex-start" w="100%">
                        <Title order={2}>{book.title}</Title>
                        <Flex wrap="wrap" gap="sm">
                            {book.authors.map(author => (
                                <AuthorPreview key={author.id} author={author}/>
                            ))}
                        </Flex>
                    </Flex>
                    <Text>{book.description}</Text>
                    {renderActionArea()}
                </Stack>
            )}

        </Box>
    );
};

export default Page;