/**
 * API endpoints definition
 * Define all your API endpoints here with proper typing
 */
import { Book } from "@/types";

import { api } from "./api";

// ===== Types =====

// ===== Books API =====
export const books = {
  // Get all books
  getAll: api.query<Book[]>("books"),

  // Get book by ID
  getById: api.query<Book, { id: number }>((params) => `books/${params.id}`, {
    queryKey: (params) => ["books", params.id] as const,
  }),
};
