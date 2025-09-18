import { type DBClient, type Connection } from "../../util/database.mjs";
import { ConnectionStatus } from "../../generated/prisma/index.js";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function updateStatus(
  logger: Logger,
  client: DBClient,
  userId: string,
  quilttConnectionId: string,
  status: ConnectionStatus,
): Promise<Connection | null> {
  try {
    return await client.connection.update({
      where: {
        quilttConnectionId: quilttConnectionId,
        userId,
      },
      data: {
        status: status,
      },
    });
  } catch (err) {
    logger.error(
      {
        error: err,
        tags: ["database", "connection", "updateStatus"],
      },
      "Failed to update connection status",
    );
    return null;
  }
}
