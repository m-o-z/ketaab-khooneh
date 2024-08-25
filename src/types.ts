export type Author = {
  id: string;
  name: string;
  bio?: string;
  author_img?: string;
  email?: string
  nick_name?: string
};

export type Comment = {
  content: string;
};

export type BookStatus =
  | "NOT_AVAILABLE"
  | "AVAILABLE"
  | "BORROWED"
  | "RESERVED_BY_OTHERS"
  | "RESERVED_BY_ME";

export type Book = {
  id: string;
  title: string;
  expand: {
    author: Author[]
  }
  cover_image: string;
  status: BookStatus,
  author: Author[];
  description: string;
  edition: string;
  release_year: string;
  available_count: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  comments?: Comment[];
  history: Borrow[];
};

export type Borrow = {
  id: string;
  user: User["id"];
  book: Book["id"];
  startDate: string;
  endDate: string;
};
