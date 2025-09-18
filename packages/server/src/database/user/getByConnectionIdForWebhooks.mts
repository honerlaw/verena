import type { Logger } from "@onerlaw/framework/backend/logger";
import type { DBClient } from "../../util/database.mjs";

export async function getByConnectionIdForWebhooks(
  logger: Logger,
  client: DBClient,
  connectionId: string,
) {
  try {
    return await client.user.findFirst({
      where: {
        connections: {
          some: {
            quilttConnectionId: connectionId,
          },
        },
      },
    });
  } catch (error) {
    logger.error(
      {
        error,
        tags: ["database", "user", "getByConnectionIdForWebhooks"],
      },
      "Error getting user by connection id for webhooks",
    );
    return null;
  }
}
