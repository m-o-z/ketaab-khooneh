"use client"
import React from 'react';
import {Box, Paper, Text} from "@mantine/core";
import type {Book} from "@/types";
import {useRouter} from "next/navigation";
import BookStatus from "../BookStatus";

type Props = {
    book: Book,
    hideBottomTexts?: boolean;
    onClick?: () => void;
}

const BookPreview = ({book, hideBottomTexts, onClick = () => {}}: Props) => {
    const router = useRouter();
    return (
        <Paper onClick={onClick} style={{flex: 1,maxWidth: '150px', width: '100%'}}>
            <Box pos="relative">
                <Box pos="absolute" top={0} left={0} style={{zIndex: 1}}>
                    <BookStatus status={book.status}/>
                </Box>
                <img src={book.coverImage} alt={`${book.title} cover`} width="100%"
                     style={{ filter: `grayscale(${book.status === "AVAILABLE" ? 0 : 1})`}}/>
                {!hideBottomTexts && <Text truncate="end" size="sm">{book.title}</Text>}
                {!hideBottomTexts && <Text truncate="end" size="xs">{book.authors.map(author => author.name).join(', ')}</Text>}
            </Box>
        </Paper>
    );
};

export default BookPreview;