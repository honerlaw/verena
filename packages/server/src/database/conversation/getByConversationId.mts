import { type Logger } from "@onerlaw/framework/backend/logger";
import { type DBClient } from "../../util/database.mjs";

export async function getByConversationId(
  logger: Logger,
  client: DBClient,
  conversationId: string,
) {
  try {
    return await client.conversation.findUnique({
      where: {
        openaiConversationId: conversationId,
      },
    });
  } catch (error) {
    logger.error(
      {
        error,
        tags: ["database", "conversation", "getByConversationId"],
      },
      "Error getting conversation by id",
    );
    return null;
  }
}
