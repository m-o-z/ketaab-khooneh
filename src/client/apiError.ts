/**
 * Custom error class for API responses.
 * @template T - The type of the data payload in the error response.
 */
export class ApiError<T = any> extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly data: T;

  constructor(status: number, statusText: string, data: T) {
    // Determine the error message
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Request failed with status ${status}`;

    super(message);

    // Set properties
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;

    // This is for maintaining the stack trace
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
