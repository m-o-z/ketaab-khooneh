// TODO: complete types

export type Book = {
    id: string;
    title: string;
    description: string;
}

export type User = {
    id: string;
    name: string;
}

export type Lend = {
    id: string;
    user: User['id'];
    book: Book['id'];
}
