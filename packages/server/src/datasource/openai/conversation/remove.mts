import { type Logger } from "@onerlaw/framework/backend/logger";
import { type OpenAI } from "openai";

export async function remove(
  logger: Logger,
  client: OpenAI,
  conversationId: string,
) {
  try {
    return await client.conversations.delete(conversationId);
  } catch (error) {
    logger.error(
      {
        error,
        tags: ["datasource", "openai", "conversation", "remove"],
      },
      "Error removing conversation",
    );
    return null;
  }
}
