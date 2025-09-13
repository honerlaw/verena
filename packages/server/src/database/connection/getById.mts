import {
  type DBClient,
  type Connection,
  type User,
} from "../../util/database.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";

export type ConnectionWithUser = Connection & {
  user: User;
};

export async function getById(
  logger: Logger,
  client: DBClient,
  connectionId: string,
): Promise<ConnectionWithUser | null> {
  try {
    return await client.connection.findUnique({
      where: {
        id: connectionId,
      },
      include: {
        user: true,
      },
    });
  } catch (err) {
    logger.error(
      {
        error: err,
        tags: ["database", "connection", "getById"],
        attributes: {
          connectionId,
        },
      },
      "Failed to get connection by id",
    );
    return null;
  }
}
