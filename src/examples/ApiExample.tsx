'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { books, users, Book, CreateBookInput } from '../client';

export default function ApiExample() {
  const queryClient = useQueryClient();
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [selectedBookId, setSelectedBookId] = useState<number | undefined>();
  
  // Get all books or filtered books based on selected genre
  const { data: booksList, isLoading } = useQuery(
    selectedGenre 
      ? books.getFiltered({ genre: selectedGenre })
      : books.getAll
  );
  
  // Get a specific book when selected
  const { data: selectedBook } = useQuery({
    ...books.getById({ id: selectedBookId! }),
    enabled: selectedBookId !== undefined,
  });
  
  // Get all users
  const { data: usersList } = useQuery(users.getAll);
  
  // Create book mutation
  const createBookMutation = useMutation({
    ...books.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
  
  // Update book mutation
  const updateBookMutation = useMutation({
    ...books.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
  
  // Delete book mutation
  const deleteBookMutation = useMutation({
    ...books.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      if (selectedBookId) {
        setSelectedBookId(undefined);
      }
    },
  });
  
  // Example form state for creating a new book
  const [newBook, setNewBook] = useState<CreateBookInput>({
    title: '',
    author: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    genre: [],
    description: '',
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: name === 'publishedYear' ? parseInt(value) : value,
    }));
  };
  
  // Handle genre selection (multiple genres)
  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setNewBook(prev => ({
      ...prev,
      genre: checked 
        ? [...prev.genre, value]
        : prev.genre.filter(g => g !== value),
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBookMutation.mutate(newBook);
  };
  
  // Handle book deletion
  const handleDeleteBook = (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      deleteBookMutation.mutate({ id });
    }
  };
  
  if (isLoading) return <div>Loading books...</div>;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Example</h1>
      
      {/* Filter by genre */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter by Genre</h2>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 rounded ${!selectedGenre ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedGenre(undefined)}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 rounded ${selectedGenre === 'fiction' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedGenre('fiction')}
          >
            Fiction
          </button>
          <button 
            className={`px-3 py-1 rounded ${selectedGenre === 'non-fiction' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedGenre('non-fiction')}
          >
            Non-Fiction
          </button>
        </div>
      </div>
      
      {/* Books list */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Books List</h2>
        {booksList?.length === 0 ? (
          <p>No books found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {booksList?.map(book => (
              <div 
                key={book.id} 
                className={`border rounded p-4 cursor-pointer ${selectedBookId === book.id ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setSelectedBookId(book.id)}
              >
                <h3 className="font-bold">{book.title}</h3>
                <p className="text-sm">By {book.author}</p>
                <p className="text-xs text-gray-500">Published: {book.publishedYear}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {book.genre.map(g => (
                    <span key={g} className="text-xs bg-gray-200 px-2 py-1 rounded">{g}</span>
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <button 
                    className="text-red-500 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(book.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected book details */}
      {selectedBook && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Book Details</h2>
          <h3 className="text-lg font-bold">{selectedBook.title}</h3>
          <p><strong>Author:</strong> {selectedBook.author}</p>
          <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
          <p><strong>Published:</strong> {selectedBook.publishedYear}</p>
          <p><strong>Genres:</strong> {selectedBook.genre.join(', ')}</p>
          <p className="mt-2"><strong>Description:</strong></p>
          <p>{selectedBook.description}</p>
          <button 
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
            onClick={() => setSelectedBookId(undefined)}
          >
            Close
          </button>
        </div>
      )}
      
      {/* Users list (simple example) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <ul className="list-disc pl-5">
          {usersList?.map(user => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      </div>
      
      {/* Create new book form */}
      <div className="mt-8 border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={newBook.isbn}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Published Year</label>
            <input
              type="number"
              name="publishedYear"
              value={newBook.publishedYear}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Genres</label>
            <div className="flex flex-wrap gap-4">
              {['fiction', 'non-fiction', 'classic', 'fantasy', 'sci-fi'].map(genre => (
                <label key={genre} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="genre"
                    value={genre}
                    checked={newBook.genre.includes(genre)}
                    onChange={handleGenreChange}
                    className="mr-2"
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={newBook.description}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows={4}
              required
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={createBookMutation.isPending}
          >
            {createBookMutation.isPending ? 'Creating...' : 'Create Book'}
          </button>
        </form>
      </div>
    </div>
  );
}
