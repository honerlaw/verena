import { type QuilttClient } from "./client.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";
import { SessionTokenSchema, type SessionToken } from "./types.js";

export async function createSessionToken(
  logger: Logger,
  client: QuilttClient,
  userId?: string | null,
  email?: string | null,
): Promise<SessionToken | null> {
  try {
    return await client.request(`/v1/users/sessions`, {
      method: "POST",
      logger,
      body: userId
        ? {
            userId,
            email,
          }
        : null,
      schema: SessionTokenSchema,
    });
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Error creating session token",
    );
    return null;
  }
}
