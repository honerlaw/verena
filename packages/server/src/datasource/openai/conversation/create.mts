import { type Logger } from "../../../util/logger/index.mjs";
import { type OpenAI } from "openai";

export async function create(logger: Logger, client: OpenAI, userId: string) {
  try {
    return await client.conversations.create({
      metadata: {
        userId,
      },
    });
  } catch (error) {
    logger.error(
      {
        error,
        tags: ["datasource", "openai", "create"],
      },
      "Error creating conversation",
    );
    return null;
  }
}
