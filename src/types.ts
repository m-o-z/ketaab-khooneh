export type Author = {
  id: string;
  name: string;
  bio?: string;
  author_img?: string;
  email?: string;
  nick_name?: string;
};

export type Comment = {
  content: string;
};

export type BookCategory = {
  id: string;
  label: string;
  slug: string;
  category_icon: string;
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
  categories: string[];
  expand: {
    authors: Author[];
    categories: BookCategory[];
  };
  cover_image: string;
  status: BookStatus;
  authors: string[];
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
  username: string;
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

export type ListFetchingParams = {
  search?: string;
  page?: number;
  perPage?: number;
  filters?: string[];
};
