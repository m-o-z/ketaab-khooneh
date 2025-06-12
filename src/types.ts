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

export type ResponseWrap<T> = { status: "OK"; data: T };

export type BookCategory = {
  id: string;
  label: string;
  slug: string;
  category_icon: string;
};

export type BookStatus =
  | "UNAVAILABLE"
  | "AVAILABLE"
  | "BORROWED"
  | "RESERVED_BY_OTHERS"
  | "RESERVED_BY_ME";

export type BookWork = {
  id: string;
  title: string;
  categories: string[];
  expand: {
    authors: Author[];
    categories: BookCategory[];
    books_via_bookWork: Book[];
  };
  authors: string[];
};

export type Book = {
  expand: {
    bookWork: BookWork;
  };
  bookWork: BookWork;
  id: string;
  subTitle: string;
  coverImage: string;
  status: BookStatus;
  description: string;
  edition: string;
  language: string;
  releaseYear: string;
  availableCount: number;
  totalCount: number;
};

export interface UserInfo {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: Date;
  email: string;
  emailVisibility: boolean;
  id: string;
  updated: Date;
  verified: boolean;
  firstName: string;
  lastName: string;
  isPunished: boolean;
  punishmentEndAt: Date;
}

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
