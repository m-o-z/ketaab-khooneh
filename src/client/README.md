# Simple Type-Safe API Client

A lightweight, type-safe API client designed to work seamlessly with TanStack Query (React Query).

## Features

- Minimal boilerplate
- Full TypeScript support with excellent type inference
- Direct integration with TanStack Query's `useQuery` and `useMutation`
- Centralized API endpoint definitions
- Automatic query key generation
- Built-in error handling

## Usage

### Basic Query Example

```tsx
import { useQuery } from "@tanstack/react-query";
import { books } from "@/client";

function BooksList() {
  // Get all books
  const { data: allBooks, isLoading } = useQuery(books.getAll());

  // Get a specific book
  const { data: book } = useQuery(books.getById({ id: 1 }));

  // Get filtered books
  const { data: filteredBooks } = useQuery(
    books.getFiltered({
      genre: "fiction",
      publishedAfter: 2000,
    }),
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>{allBooks?.map((book) => <div key={book.id}>{book.title}</div>)}</div>
  );
}
```

### Mutation Example

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { books } from "@/client";

function CreateBookForm() {
  const queryClient = useQueryClient();

  const createBook = useMutation({
    ...books.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleSubmit = (bookData) => {
    createBook.mutate(bookData);
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

## API Structure

### Creating API Endpoints

Define your endpoints in `endpoints.ts`:

```typescript
// Query endpoint without parameters
const getAll = api.query<ResponseType>("endpoint-path");

// Query endpoint with parameters
const getById = api.query<ResponseType, { id: number }>(
  (params) => `endpoint-path/${params.id}`,
  { queryKey: (params) => ["customKey", params.id] },
);

// Mutation endpoint
const create = api.mutation<ResponseType, InputType>("endpoint-path", {
  method: "POST",
});

// Mutation with dynamic path
const update = api.mutation<ResponseType, InputType & { id: number }>(
  (params) => `endpoint-path/${params.id}`,
  {
    method: "PUT",
    transformVariables: ({ id, ...data }) => data,
  },
);
```

### Custom Configuration

You can create a custom API instance with different configuration:

```typescript
import { createApi } from "@/client";

const customApi = createApi({
  baseUrl: "https://api.example.com",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Use it to create endpoints
const customEndpoint = customApi.query<ResponseType>("custom-endpoint");
```

## Adding New Endpoints

To add new endpoints:

1. Define your data types in `endpoints.ts`
2. Create your endpoint definitions using `api.query` or `api.mutation`
3. Export them from the appropriate namespace

Example:

```typescript
// Define types
export interface Product {
  id: number;
  name: string;
  price: number;
}

// Create and export endpoints
export const products = {
  getAll: api.query<Product[]>("products"),
  getById: api.query<Product, { id: number }>(
    (params) => `products/${params.id}`,
    { queryKey: (params) => ["products", params.id] },
  ),
  create: api.mutation<Product, Omit<Product, "id">>("products"),
};
```
