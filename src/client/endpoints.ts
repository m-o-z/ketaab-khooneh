/**
 * API endpoints definition
 * Define all your API endpoints here with proper typing
 */
import { api } from './api';

// ===== Types =====

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface UserFilters {
  name?: string;
  email?: string;
}

// Book types
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string[];
  description: string;
  coverImage?: string;
}

export interface BookFilters {
  genre?: string;
  author?: string;
  publishedAfter?: number;
  publishedBefore?: number;
  limit?: number;
  page?: number;
}

export interface CreateBookInput {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string[];
  description: string;
  coverImage?: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string[];
  description?: string;
  coverImage?: string;
}

// ===== Users API =====
export const users = {
  // Get all users
  getAll: api.query<User[]>('users'),
  
  // Get user by ID
  getById: api.query<User, { id: number }>(
    params => `users/${params.id}`,
    { queryKey: params => ['users', params.id] as const }
  ),
  
  // Get users with filters
  getFiltered: api.query<User[], UserFilters>(
    'users',
    { queryKey: params => ['users', 'filtered', params] as const }
  ),
  
  // Create a user
  create: api.mutation<User, Omit<User, 'id'>>('users'),
  
  // Update a user
  update: api.mutation<User, Partial<User> & { id: number }>(
    params => `users/${params.id}`,
    { 
      method: 'PUT',
      transformVariables: ({ id, ...data }) => data 
    }
  ),
  
  // Delete a user
  delete: api.mutation<void, { id: number }>(
    params => `users/${params.id}`,
    { method: 'DELETE' }
  ),
};

// ===== Books API =====
export const books = {
  // Get all books
  getAll: api.query<Book[]>('books'),
  
  // Get book by ID
  getById: api.query<Book, { id: number }>(
    params => `books/${params.id}`,
    { queryKey: params => ['books', params.id] as const }
  ),
  
  // Get books with filters
  getFiltered: api.query<Book[], BookFilters>(
    'books',
    { queryKey: params => ['books', 'filtered', params] as const }
  ),
  
  // Create a book
  create: api.mutation<Book, CreateBookInput>(
    'books',
    { method: 'POST' }
  ),
  
  // Update a book
  update: api.mutation<Book, UpdateBookInput & { id: number }>(
    params => `books/${params.id}`,
    { 
      method: 'PUT',
      transformVariables: ({ id, ...data }) => data 
    }
  ),
  
  // Delete a book
  delete: api.mutation<void, { id: number }>(
    params => `books/${params.id}`,
    { method: 'DELETE' }
  ),
};
