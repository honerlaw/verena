import type { Logger } from "@onerlaw/framework/backend/logger";
import type { DBClient } from "../../util/database.mjs";

export async function create(
  logger: Logger,
  client: DBClient,
  userId: string,
  openaiConversationId: string,
) {
  try {
    return await client.conversation.create({
      data: {
        userId,
        openaiConversationId,
      },
    });
  } catch (error) {
    logger.error(
      {
        error,
        tags: ["database", "conversation", "create"],
      },
      "Error creating conversation",
    );
    return null;
  }
}
