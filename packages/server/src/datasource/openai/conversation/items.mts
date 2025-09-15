import { type Logger } from "@onerlaw/framework/backend/logger";
import { type OpenAI } from "openai";

export async function items(
  logger: Logger,
  client: OpenAI,
  conversationId: string,
) {
  try {
    return await client.conversations.items.list(conversationId);
  } catch (error) {
    logger.error(
      {
        error,
        tags: ["datasource", "openai", "items"],
      },
      "Error getting items",
    );
  }
}
