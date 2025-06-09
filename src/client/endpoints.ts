import { RequestOTPRequestPayload } from "@/app/api/auth/login/login.schema";
import { VerifyOTPRequestPayload } from "@/app/api/auth/verify/verify.schema";
import { Author, Book, BookCategory, ResponseWrap, UserInfo } from "./../types";
/**
 * API endpoints definition
 * Define all your API endpoints here with proper typing
 */
import { AuthorListingRequestPayload } from "@/schema/authors";
import { BookListingRequestPayload } from "@/schema/books";
import { api } from "./api";

// ===== Types =====

// User types
export const users = {
  me: api.query<ResponseWrap<UserInfo>>("users/me"),
  // Get all users
  // getAll: api.query<User[]>("users"),
  // // Get user by ID
  // getById: api.query<User, { id: number }>((params) => `users/${params.id}`, {
  //   queryKey: (params) => ["users", params.id] as const,
  // }),
  // // Get users with filters
  // getFiltered: api.query<User[], UserFilters>("users", {
  //   queryKey: (params) => ["users", "filtered", params] as const,
  // }),
  // // Create a user
  // create: api.mutation<User, Omit<User, "id">>("users"),
  // // Update a user
  // update: api.mutation<User, Partial<User> & { id: number }>(
  //   (params) => `users/${params.id}`,
  //   {
  //     method: "PUT",
  //     transformVariables: ({ id, ...data }) => data,
  //   },
  // ),
  // // Delete a user
  // delete: api.mutation<void, { id: number }>((params) => `users/${params.id}`, {
  //   method: "DELETE",
  // }),
};

// ===== Books API =====
export const books = {
  // Get all books
  getAll: api.query<ResponseWrap<Book[]>, BookListingRequestPayload>("books", {
    queryKey: (params) => ["books", "filtered", params],
  }),

  // Get book by ID
  getById: (bookId: string) =>
    api.query<ResponseWrap<Book>>(() => `books/${bookId}`, {
      queryKey: (params) => ["books", params.id] as const,
    }),
};

export const authors = {
  // Get all books
  getAll: api.query<ResponseWrap<Author[]>, AuthorListingRequestPayload>(
    "authors",
    {
      queryKey: (params) => ["authors", "filtered", params],
    },
  ),
  getById: (authorId: string) =>
    api.query<ResponseWrap<Book>>(() => `authors/${authorId}`, {
      queryKey: (params) => ["authors", params.id] as const,
    }),
};

export const auth = {
  login: api.mutation<{ otpId: string }, RequestOTPRequestPayload>(
    "auth/login",
    {
      method: "POST",
    },
  ),

  verify: api.mutation<
    { token: string; record: UserInfo },
    VerifyOTPRequestPayload
  >("auth/verify", {
    method: "POST",
  }),

  logout: api.mutation<null, {}>("auth/logout", {
    method: "POST",
  }),
};
// ===== Categories API =====
export const categories = {
  getAll: api.query<ResponseWrap<BookCategory[]>>("categories"),
};
