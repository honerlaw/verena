import { type DBClient, type Connection } from "../../util/database.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function create(
  logger: Logger,
  client: DBClient,
  userId: string,
  connectionId: string,
): Promise<Connection | null> {
  try {
    return await client.connection.create({
      data: {
        userId: userId,
        quilttConnectionId: connectionId,
      },
    });
  } catch (err) {
    logger.error(
      {
        error: err,
        tags: ["database", "connection", "create"],
      },
      "Failed to create connection",
    );
    return null;
  }
}
