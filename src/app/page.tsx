'use client'
// import BookPreview from "components/BookPreview";
import type {Book} from "@/types";
import {Flex} from "@mantine/core";
import {books} from "@/mock";
import {useRouter} from "next/navigation";
import Link from "next/link";
import BookPreview from "@/components/book/BookPreview";

export default function Home() {
    const router = useRouter();
    return (
        <Flex  gap="lg" wrap={"wrap"} >
            {true ? (
                <>
                    {books.map((book: Book) => (
                        <Link key={book.id} href={`book/${book.id}`}>
                            <BookPreview onClick={() => router.push(`book/${book.id}`)} book={book}  />
                        </Link>
                    ))}
                </>
            ): (
                <>
            <BookPreview.Loading />
            <BookPreview.Loading />
            <BookPreview.Loading />
            <BookPreview.Loading />
            <BookPreview.Loading />
            <BookPreview.Loading />
            <BookPreview.Loading />
                </>
            )}

        </Flex>
    );
}
