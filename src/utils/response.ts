import { PageMeta } from "./pagination";

export type ApiResponse<T> = {
  status: string;
  data: T;
  message?: string;
};

export const createResponsePayload = <T>(
  data: T,
  message?: string,
): ApiResponse<T> => {
  const result: ApiResponse<T> = {
    status: "OK",
    data,
  };

  if (message) {
    result["message"] = message;
  }
  return result;
};

export interface ApiPagedResponse<T> extends Omit<ApiResponse<T>, "data"> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}
export const createPagedResponsePayload = <T>(
  data: T[],
  meta: PageMeta,
  message?: string,
) => {
  const result: ApiPagedResponse<T> = {
    status: "OK",
    data: data,
    meta: {
      page: meta.page,
      perPage: meta.perPage,
      totalItems: meta.totalItems,
      totalPages: meta.totalPages,
    },
  };

  if (message) {
    result.message = message;
  }

  return result;
};

export type ApiErrorResponse = {
  status: "ERR";
  type: "validation" | "internal";
  errors?:
    | Record<string, string>
    | Record<string, string[] | undefined | string>;
  message: string;
};
