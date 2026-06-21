import { timingSafeEqual } from "node:crypto";
import { z, type ZodType } from "zod";
import type { ApiFailure, ApiSuccess } from "../api/contracts";
import { getServerConfig } from "../config.server";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function jsonSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data } as ApiSuccess<T>, { status });
}

export function jsonFailure(status: number, code: string, message: string, details?: unknown) {
  const body: ApiFailure = {
    success: false,
    error: { code, message, ...(details === undefined ? {} : { details }) },
  };
  return Response.json(body, { status });
}

export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1_000_000) {
    throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Request body exceeds 1 MB");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body must be valid JSON");
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ApiError(
      422,
      "VALIDATION_ERROR",
      "Request validation failed",
      result.error.flatten(),
    );
  }
  return result.data;
}

export function requireAdmin(request: Request) {
  const expected = getServerConfig().adminApiKey;
  if (!expected) {
    throw new ApiError(
      503,
      "ADMIN_AUTH_NOT_CONFIGURED",
      "ADMIN_API_KEY must be configured on the server",
    );
  }

  const actual = request.headers.get("x-admin-key") ?? "";
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  if (
    expectedBuffer.length !== actualBuffer.length ||
    !timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    throw new ApiError(401, "UNAUTHORIZED", "A valid admin API key is required");
  }
}

export function isAdmin(request: Request): boolean {
  const expected = getServerConfig().adminApiKey;
  if (!expected) return false;

  const actual = request.headers.get("x-admin-key") ?? "";
  try {
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(actual);
    return (
      expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer)
    );
  } catch {
    return false;
  }
}

export async function handleApi(action: () => Promise<Response> | Response) {
  try {
    return await action();
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonFailure(error.status, error.code, error.message, error.details);
    }
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return jsonFailure(409, "CONFLICT", "A record with the same unique value already exists");
    }
    console.error(error);
    return jsonFailure(500, "INTERNAL_ERROR", "An unexpected server error occurred");
  }
}
