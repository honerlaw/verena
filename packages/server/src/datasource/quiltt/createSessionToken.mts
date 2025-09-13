import { type QuilttClient } from "./client.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";
import { SessionTokenSchema, type SessionToken } from "./types.js";

// essentially, if it has a user id, it will use that
// if it doesn't it will actually create a new session token
export async function createSessionToken(
  logger: Logger,
  client: QuilttClient,
  userId: string,
  email?: string | null,
): Promise<SessionToken | null> {
  try {
    return await client.request(`/v1/users/sessions`, {
      method: "POST",
      logger,
      body: {
        uuid: userId,
        email,
      },
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
