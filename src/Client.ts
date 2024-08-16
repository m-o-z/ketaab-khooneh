// TODO: fix this file based on pocket base API
// TODO: refactor
import {Book, User, Borrow, Author} from "@/types";

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

type PaginationQuery = {
    page: number;
    limit: number;
}

export class Client {
  private baseUrl: string;
  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl;
  }

  private async request(options: RequestOptions) {
    // TODO: handle errors
    const { path, method, query, body } = options;
    const queryString = query
      ? '?' + Object.entries(query).map(([k, v]) => `${k}=${v.toString()}`).join('&')
      : "";
    const fullUrl = `${this.baseUrl}${path}${queryString}`;
    const response = await fetch(fullUrl, {
        method,
        ...(body && { body }),
    });
      return await response.json();
  }

  public readonly book = {
    list: (query: PaginationQuery) =>
      this.request({
        path: "/books",
        method: "GET",
        query
      }),
    get: (id: Book['id']) =>
      this.request({
        path: `/books/${id}`,
        method: "GET",
      }),
  };
}

export const client = new Client({
  baseUrl: "FIXIT!",
});
