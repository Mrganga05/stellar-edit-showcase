import type { ApiFailure, ApiResponse } from "./contracts";

export class ApiClientError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, failure: ApiFailure) {
    super(failure.error.message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = failure.error.code;
    this.details = failure.error.details;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    const failure: ApiFailure = payload.success
      ? {
          success: false,
          error: { code: "HTTP_ERROR", message: `Request failed with status ${response.status}` },
        }
      : payload;
    throw new ApiClientError(response.status, failure);
  }
  return payload.data;
}
