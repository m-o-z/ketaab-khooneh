import type { Author, Book, User } from "@/types";

export const users: User[] = [
  {
    id: "1",
    firstName: "behnam",
    lastName: "banaei",
    image: "https://picsum.photos/202",
    email: "example@test.com",
    history: [],
  },
  {
    id: "2",
    firstName: "amin",
    lastName: "saveh",
    image: "https://picsum.photos/203",
    email: "example@test.com",
    history: [],
  },
];

export const authors: Author[] = [
  {
    id: "1",
    name: "amirhossein alibakhsi",
    bio: "lksdjflkdsf",
    image: "https://picsum.photos/201",
  },
  {
    id: "2",
    name: "hossei nasiri",
    bio: "lksdjflkdsf",
    image: "https://picsum.photos/200",
  },
];

export const books: Book[] = [
  {
    title: "Clean Code",
    authors,
    coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
    status: "BORROWED",
    id: "1",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    edition: "1",
    releaseYear: "2023",
    borrowedBy: users[0],
    count: 2,
    category: '123',
    history: [],
  },
  {
    title: "Clean Code",
    authors,
    coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
    status: "AVAILABLE",
    id: "2",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    edition: "1",
    releaseYear: "2023",
    count: 1,
    category: '123',
    history: [],
  },
  {
    title: "Clean Code",
    authors,
    coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
    status: "NOT_AVAILABLE",
    id: "3",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    edition: "1",
    releaseYear: "2023",
    count: 1,
    category: '123',
    history: [],
  },
  {
    title: "Clean Code",
    authors,
    coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
    status: "RESERVED_BY_ME",
    id: "4",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    edition: "1",
    releaseYear: "2023",
    count: 1,
    category: '123',
    history: [],
  },
  {
    title: "Clean Code",
    authors,
    coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
    status: "RESERVED_BY_OTHERS",
    id: "5",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    edition: "1",
    releaseYear: "2023",
    reservedBy: users[1],
    count: 1,
    category: '123',
    history: [],
  },
];
