import { type Logger } from "@onerlaw/framework/backend/logger";
import { type QuilttClient } from "./client.mjs";
import { SessionTokenSchema, type SessionToken } from "./types.js";

export async function introspectSessionToken(
  logger: Logger,
  client: QuilttClient,
  token: string,
): Promise<SessionToken | null> {
  try {
    return await client.request(`/v1/introspect/session_token`, {
      method: "POST",
      logger,
      token,
      schema: SessionTokenSchema,
    });
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Error introspecting session token",
    );
    return null;
  }
}
