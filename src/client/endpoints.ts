import { Book } from "./../types";
/**
 * API endpoints definition
 * Define all your API endpoints here with proper typing
 */
import { api } from "./api";

// ===== Types =====

// User types
export const users = {
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
  getAll: api.query<Book[]>("books"),

  // Get book by ID
  getById: (bookId: string) =>
    api.query<Book>(() => `books/${bookId}`, {
      queryKey: (params) => ["books", params.id] as const,
    }),
};
