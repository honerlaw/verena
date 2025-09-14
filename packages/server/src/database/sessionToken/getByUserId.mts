import { type DBClient, type SessionToken } from "../../util/database.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function getByUserId(
  logger: Logger,
  client: DBClient,
  userId: string,
): Promise<SessionToken | null> {
  try {
    const sessionToken = await client.sessionToken.findUnique({
      where: {
        userId: userId,
      },
    });

    return sessionToken;
  } catch (err) {
    logger.error(
      {
        error: err,
        attributes: {
          userId: userId,
        },
      },
      "Failed to retrieve session token by userId",
    );
    return null;
  }
}
