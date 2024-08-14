'use client'
import React from 'react';
import {useParams} from "next/navigation";
import {authors, books} from "@/mock";
import BookPreview from "../../components/book/BookPreview";
import {Avatar, Flex, Text} from "@mantine/core";
import AuthorPreview from "@/app/components/author/AuthorPreview/AuthorPreview";
// TODO: fix style
const Page = () => {
    const {authorId} = useParams();
    const author = authors.find(author => author.id === authorId)
    return (
        <div>
            {author && (
                <Flex direction="column" gap="xs">
                    <Avatar size="xl" src={author.image} name={author.name} color="initials" />
                    <Text>{author.name}</Text>
                    <Text>{author.bio}</Text>
                </Flex>
            )}
        </div>
    );
};

export default Page;