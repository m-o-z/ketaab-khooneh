import type {Author, Book} from "@/types";

export const authors: Author[] = [
    {
        id: '1',
        name: 'amirhossein alibakhsi',
        bio: 'lksdjflkdsf',
        image: 'https://picsum.photos/201'
    },
    {
        id: '2',
        name: 'hossei nasiri',
        bio: 'lksdjflkdsf',
        image: 'https://picsum.photos/200'
    }
]

export const books: Book[] = [
    {
        title: "Clean Code",
        authors,
        coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
        status: 'BORROWED',
        id: '1',
        description: "Clean Codesss",
        edition: '1',
        releaseYear: '2023'
    },
    {
        title: "Clean Code",
        authors,
        coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
        status: 'AVAILABLE',
        id: '2',
        description: "Clean Codesss",
        edition: '1',
        releaseYear: '2023'
    },
    {
        title: "Clean Code",
        authors,
        coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
        status: 'NOT_AVAILABLE',
        id: '3',
        description: "Clean Codesss",
        edition: '1',
        releaseYear: '2023'
    },
    {
        title: "Clean Code",
        authors,
        coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
        status: 'RESERVED_BY_ME',
        id: '4',
        description: "Clean Codesss",
        edition: '1',
        releaseYear: '2023'
    },
    {
        title: "Clean Code",
        authors,
        coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
        status: 'RESERVED_BY_OTHERS',
        id: '5',
        description: "Clean Codesss",
        edition: '1',
        releaseYear: '2023'
    },

]