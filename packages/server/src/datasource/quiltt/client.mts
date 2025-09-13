import type { Logger } from "@onerlaw/framework/backend/logger";
import z from "zod";
import { ErrorResponseSchema } from "./types.js";

const BASE_URL = "https://auth.quiltt.io";

type RequestParams<T = unknown> = {
  method: "POST" | "GET" | "DELETE";
  logger: Logger;
  token?: string;
  schema?: z.ZodSchema<T>;
  body?: Record<string, unknown> | undefined | null;
};

export const quilttClient = {
  request: async <T = unknown,>(
    url: string,
    { logger, method, token, body, schema }: RequestParams<T>,
  ): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        Authorization: `Bearer ${token || process.env.QUILTT_API_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    const json = await response.json();

    // so basically none 2xx, so parse the error and throw it
    if (!response.ok) {
      const errorResponse = await ErrorResponseSchema.safeParseAsync(json);
      if (!errorResponse.success) {
        logger.error(
          {
            attributes: {
              status: response.status,
              statusText: response.statusText,
              response: json,
            },
          },
          "Error response",
        );

        throw new Error("Failed to parse error response.");
      }

      logger.error(
        {
          error: errorResponse.error,
          attributes: {
            response: json,
          },
        },
        "Error response",
      );

      throw new Error(errorResponse.data.message);
    }

    if (!schema) {
      return json as T;
    }

    const result = await schema?.safeParseAsync(json);

    if (!result.success) {
      logger.error(
        {
          error: result.error,
          attributes: {
            response: response,
          },
        },
        "Error introspecting session token",
      );
      throw new Error("Failed to parse response.");
    }

    if (!result.data) {
      throw new Error("Failed to parse response. No data.");
    }

    return result.data as T;
  },
};

export type QuilttClient = typeof quilttClient;
