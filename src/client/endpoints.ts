import { RequestOTPRequestPayload } from "@/app/api/auth/login/login.schema";
import { VerifyOTPRequestPayload } from "@/app/api/auth/verify/verify.schema";
import {
  AuthorsListingRequestPayload,
  BookListingRequestPayload,
} from "@/app/api/authors/route.schema";
import { AuthorDTO } from "@/schema/authors";
import { BookDTO } from "@/schema/books";
import { BorrowBriefDTO, BorrowDTO } from "@/schema/borrows";
import { ApiPagedResponse, ApiResponse } from "@/utils/response";

import { SubscriptionDTO } from "@/schema/subscription";
import { UserDB, UserDTO } from "@/schema/users";
import { Author, BookCategory, ResponseWrap, UserInfo } from "./../types";
import { api } from "./api";

// User types
export const users = {
  me: api.query<ResponseWrap<UserDTO>>("users/me"),
  completeProfile: api.mutation<UserDB, FormData>("/users/profile/complete", {
    isFormData: true,
    method: "POST",
    headers: {
      "Content-Type": "",
    },
  }),
};

// ===== Books API =====
export const books = {
  // Get all books
  getAll: api.query<ApiPagedResponse<BookDTO>, BookListingRequestPayload>(
    "books",
    {
      queryKey: (params) => ["books", "filtered", params],
    },
  ),

  // Get book by ID
  getById: (bookId: string) =>
    api.query<ApiResponse<BookDTO>>(() => `books/${bookId}`, {
      queryKey: (params) => {
        return ["books", bookId] as const;
      },
    }),
};

export const authors = {
  // Get all books
  getAll: api.query<ResponseWrap<AuthorDTO[]>, AuthorsListingRequestPayload>(
    "authors",
    {
      queryKey: (params) => ["authors", "filtered", params],
    },
  ),
  getById: (authorId: string) =>
    api.query<ResponseWrap<AuthorDTO>>(() => `authors/${authorId}`, {
      queryKey: () => ["authors", authorId] as const,
    }),
};

export const subscriptions = {
  book: {
    availability: {
      subscribe: api.mutation<SubscriptionDTO, string>(
        (id) => `/subscriptions/book/${id}/subscribe`,
        {
          method: "POST",
        },
      ),
      unsubscribe: api.mutation<{ result: boolean }, string>(
        (id) => `/subscriptions/book/${id}/unsubscribe`,
        {
          method: "DELETE",
        },
      ),
      isSubscribed: api.query<
        ApiResponse<{ isSubscribed: boolean }>,
        { id: string }
      >(({ id }) => `/subscriptions/book/${id}/isSubscribed`),
    },
  },
};

export const auth = {
  login: api.mutation<
    { otpId: string; email: string },
    RequestOTPRequestPayload
  >("auth/login", {
    method: "POST",
  }),

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

export const borrows = {
  getAll: api.query<ApiPagedResponse<BorrowBriefDTO>>("borrows"),
  getAllPrevious:
    api.query<ApiPagedResponse<BorrowBriefDTO>>("borrows/previous"),
  reserve: (bookId: string) =>
    api.mutation(() => `/borrow/${bookId}`, {
      method: "POST",
    }),

  borrowBook: api.mutation<ApiResponse<BorrowDTO>, string>(
    (bookId: string) => `borrows/${bookId}/borrow`,
    {
      method: "POST",
    },
  ),

  returnBook: api.mutation<null, string>(
    (borrowId: string) => `borrows/${borrowId}/return`,
    {
      method: "DELETE",
    },
  ),

  extendBook: api.mutation<null, string>(
    (borrowId: string) => `borrows/${borrowId}/extend`,
    {
      method: "POST",
    },
  ),
};
// ===== Categories API =====
export const categories = {
  getAll: api.query<ResponseWrap<BookCategory[]>>("categories"),
};
