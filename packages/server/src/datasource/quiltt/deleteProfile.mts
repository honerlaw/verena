import { type QuilttClient } from "./client.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function deleteProfile(
  logger: Logger,
  client: QuilttClient,
  userId: string,
): Promise<boolean> {
  try {
    await client.request(`/v1/profiles/${userId}`, {
      method: "DELETE",
      logger,
    });
    return true;
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Error deleting profile",
    );
    return false;
  }
}
