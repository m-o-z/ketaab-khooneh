'use client'
import React from 'react';
import {useParams} from "next/navigation";
import {books} from "@/mock";
import BookPreview from "../../components/book/BookPreview";
import {Flex, Text} from "@mantine/core";
import AuthorPreview from "@/app/components/author/AuthorPreview/AuthorPreview";

// TODO: fix style
const Page = () => {
    const {bookId} = useParams();
    const selectedBook = books.find(book => book.id === bookId)
    return (
        <div>
            {selectedBook && (
                <Flex gap="md" align="center">
                    <BookPreview book={selectedBook} hideBottomTexts/>
                    <Flex direction="column" gap="md">
                        <Text size="xl">{selectedBook.title}</Text>
                        <Flex wrap="wrap" gap="sm">{selectedBook.authors.map(author => (
                            <AuthorPreview key={author.id} author={author}/>
                        ))}</Flex>
                    </Flex>
                </Flex>
            )}
        </div>
    );
};

export default Page;