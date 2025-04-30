/**
 * Simple, type-safe API client for React applications
 * Designed to work seamlessly with TanStack Query
 */

// Base configuration for API requests
interface ApiConfig extends RequestInit {
  baseUrl: string;
  defaultQueryOptions?: Record<string, any>;
}

// Default configuration
const defaultConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

// Initialize the API with configuration
export function createApi(_config: ApiConfig = defaultConfig) {
  const config = {
    ...defaultConfig,
    ...(_config ?? {}),
  };
  const { baseUrl, headers: defaultHeaders } = config;

  // Utility to build full URLs
  const getUrl = (endpoint: string) => {
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  };

  // Core fetch function with error handling
  async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = getUrl(endpoint);
    const mergedHeaders = {
      ...defaultHeaders,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...config,
        ...options,
        headers: mergedHeaders,
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        const error = new Error(
          typeof errorData === "object"
            ? JSON.stringify(errorData)
            : String(errorData),
        );
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        (error as any).data = errorData;
        throw error;
      }

      // Handle empty responses
      if (
        response.status === 204 ||
        response.headers.get("Content-Length") === "0"
      ) {
        return {} as T;
      }

      // Parse JSON response
      return (await response.json()) as T;
    } catch (error) {
      console.error(`API Error: ${url}`, error);
      throw error;
    }
  }

  // Create a query definition ready for useQuery
  function createQuery<
    TData = unknown,
    TParams extends Record<string, any> = Record<string, never>,
  >(
    endpoint: string | ((params: TParams) => string),
    options: {
      method?: "GET";
      headers?: HeadersInit;
      queryKey?: string | ((params: TParams) => unknown[]);
    } = {},
  ) {
    // For endpoints without params
    if (typeof endpoint === "string" && !options.queryKey) {
      return {
        queryKey: [endpoint.split("/")[0]] as const,
        queryFn: () =>
          fetchApi<TData>(endpoint, {
            method: options.method || "GET",
            headers: options.headers,
          }),
      };
    }

    // For endpoints with params
    return (params: TParams) => {
      const finalEndpoint =
        typeof endpoint === "function" ? endpoint(params) : endpoint;

      // Build query string for GET requests
      let url = finalEndpoint;
      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });

        const queryString = queryParams.toString();
        if (queryString) {
          url += url.includes("?") ? `&${queryString}` : `?${queryString}`;
        }
      }

      // Generate query key
      const queryKeyBase = options.queryKey || finalEndpoint.split("/")[0];
      const queryKey =
        typeof queryKeyBase === "function"
          ? queryKeyBase(params)
          : typeof queryKeyBase === "string"
            ? ([queryKeyBase, params] as const)
            : ([finalEndpoint, params] as const);

      return {
        queryKey,
        queryFn: () =>
          fetchApi<TData>(url, {
            method: options.method || "GET",
            headers: options.headers,
          }),
      };
    };
  }

  // Create a mutation definition ready for useMutation
  function createMutation<TData = unknown, TVariables = unknown>(
    endpoint: string | ((variables: TVariables) => string),
    options: {
      method?: "POST" | "PUT" | "PATCH" | "DELETE";
      headers?: HeadersInit;
      transformVariables?: (variables: TVariables) => any;
    } = {},
  ) {
    return {
      mutationFn: async (variables: TVariables) => {
        const finalEndpoint =
          typeof endpoint === "function" ? endpoint(variables) : endpoint;

        const method = options.method || "POST";
        const transformedVariables = options.transformVariables
          ? options.transformVariables(variables)
          : variables;

        return fetchApi<TData>(finalEndpoint, {
          method,
          headers: options.headers,
          body:
            transformedVariables !== undefined
              ? JSON.stringify(transformedVariables)
              : undefined,
        });
      },
    };
  }

  return {
    query: createQuery,
    mutation: createMutation,
    fetch: fetchApi,
  };
}

// Export a default API instance
export const api = createApi();

// Export types for better developer experience
export type QueryDefinition<TData, TParams = void> =
  TParams extends Record<string, never>
    ? { queryKey: readonly unknown[]; queryFn: () => Promise<TData> }
    : (params: TParams) => {
        queryKey: readonly unknown[];
        queryFn: () => Promise<TData>;
      };

export type MutationDefinition<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
};
