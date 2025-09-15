import { type Logger } from "@onerlaw/framework/backend/logger";
import { type DBClient } from "../../util/database.mjs";

export async function list(logger: Logger, client: DBClient, userId: string) {
  try {
    return await client.conversation.findMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    logger.error(
      {
        error,
        tags: ["database", "conversation", "list"],
      },
      "Error listing conversations",
    );
  }
}
