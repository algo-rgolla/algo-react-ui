export interface ApiErrorResponse {
  message: string;
}

export interface ApiDeleteSuccessResponse {
  message: string;
  success: boolean;
}

export interface ApiMessageResponse {
  message: string;
}

export type HistoryQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export class ApiHttpError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
    this.data = data;
  }
}

export function getApiErrorMessage(data: unknown): string | undefined {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }

  return undefined;
}

export function getStatusFallbackMessage(status?: number): string {
  switch (status) {
    case 400:
      return "Bad request.";
    case 404:
      return "Resource not found.";
    case 500:
      return "Internal server error.";
    default:
      return "Request failed.";
  }
}

export function assertExpectedStatus(
  status: number,
  expectedStatuses: number[],
  actionLabel: string,
): void {
  if (!expectedStatuses.includes(status)) {
    throw new ApiHttpError(
      `Unexpected status code ${status} while ${actionLabel}.`,
      status,
    );
  }
}
