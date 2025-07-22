/**
 * Simple, type-safe API client for React applications
 * Designed to work seamlessly with TanStack Query
 */

import { deepMerge } from "@mantine/core";
import appConfig from "../../app.config";
import { ApiError } from "./apiError";

// Base configuration for API requests
interface ApiConfig extends RequestInit {
  baseUrl: string;
  defaultQueryOptions?: Record<string, any>;
}

// Default configuration
const defaultConfig: ApiConfig = {
  baseUrl: appConfig.apiURL || "/api",
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
    let mergedHeaders = deepMerge(defaultHeaders!, {
      ...options.headers,
    });

    // Remove nulled headers
    mergedHeaders = Object.fromEntries(
      Object.entries(mergedHeaders).filter(([key, value]) => value),
    );

    const finalOptions = {
      ...config,
      ...options,
      headers: mergedHeaders!,
    };
    try {
      const response = await fetch(url, finalOptions);

      // Handle non-OK responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        if (response.status === 401) {
          window.location.href = "/auth/login";
        }
        throw new ApiError(response.status, response.statusText, errorData);
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
    // Always return a function
    return (params?: TParams) => {
      // Handle case where params might not be provided for no-param endpoints
      const actualParams = params || ({} as TParams);

      const finalEndpoint =
        typeof endpoint === "function" ? endpoint(actualParams) : endpoint;

      // Build query string for GET requests
      let url = finalEndpoint;
      // Use actualParams here
      if (actualParams && Object.keys(actualParams).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(actualParams).forEach(([key, value]) => {
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
      const queryKeyBase =
        options.queryKey || finalEndpoint.split("/").join("-");

      const queryKey =
        typeof queryKeyBase === "function"
          ? queryKeyBase(actualParams)
          : typeof queryKeyBase === "string"
            ? ([queryKeyBase, actualParams] as const)
            : ([finalEndpoint, actualParams] as const);

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
      isFormData?: boolean;
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

        let body: string | undefined | FormData =
          transformedVariables !== undefined
            ? JSON.stringify(transformedVariables)
            : undefined;

        if (options.isFormData) {
          body = variables as FormData;
        }

        return fetchApi<TData>(finalEndpoint, {
          method,
          headers: options.headers,
          body: body,
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
// Updated QueryDefinition to always expect a function
export type QueryDefinition<TData, TParams = Record<string, never>> = (
  params?: TParams,
) => {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
};

export type MutationDefinition<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
};
