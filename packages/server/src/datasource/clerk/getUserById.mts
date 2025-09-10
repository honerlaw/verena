import { type ClerkClient } from "@clerk/express";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function getUserById(
  logger: Logger,
  client: ClerkClient,
  userId: string,
) {
  try {
    return await client.users.getUser(userId);
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Error getting user by id",
    );
    return null;
  }
}
