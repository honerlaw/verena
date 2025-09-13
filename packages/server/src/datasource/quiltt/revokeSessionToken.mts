import { type QuilttClient } from "./client.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function revokeSessionToken(
  logger: Logger,
  client: QuilttClient,
  token: string,
): Promise<boolean> {
  try {
    await client.request(`/v1/users/sessions`, {
      method: "DELETE",
      logger,
      token,
    });
    return true;
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Error creating session token",
    );
    return false;
  }
}
