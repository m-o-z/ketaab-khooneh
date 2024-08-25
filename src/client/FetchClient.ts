// TODO: fix this file based on pocket base API
// TODO: refactor
import { Book, User, Borrow, Author } from "@/types";

type ClientOptions = {
  baseUrl: string;
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Query = Record<string, string | number>;

type RequestOptions = {
  path: `/${string}`;
  method: HttpMethod;
  query?: Query;
  body?: BodyInit;
};

export type PaginationQuery = {
  page: number;
  perPage: number;
};

export class FetchClient {
  private baseUrl: string;
  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl;
  }

  private async request(options: RequestOptions) {
    // TODO: handle errors
    const { path, method, query, body } = options;
    const queryString = query
      ? "?" +
        Object.entries(query)
          .map(([k, v]) => `${k}=${v.toString()}`)
          .join("&")
      : "";
    const fullUrl = `${this.baseUrl}${path}${queryString}`;
    const token = localStorage.getItem("_token");
    const response = await fetch(fullUrl, {
      method,
      headers: {
        Authorization: token,
      },
      ...(body && { body }),
    });
    return await response.json();
  }

  public readonly book = {
    list: (query: PaginationQuery) =>
      this.request({
        path: "/collections/books/records",
        method: "GET",
        query,
      }),
    details: (id: Book["id"]) =>
      this.request({
        path: `/books/${id}`,
        method: "GET",
      }),
  };
}

export const client = new FetchClient({
  baseUrl: "http://127.0.0.1:8080/api",
});
