import { type DBClient, type SessionToken } from "../../util/database.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function upsert(
  logger: Logger,
  client: DBClient,
  userId: string,
  token: string,
  expiresAt: Date,
): Promise<SessionToken | null> {
  try {
    return await client.sessionToken.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId: userId,
        token: token,
        expiresAt: expiresAt,
      },
      update: {
        token: token,
        expiresAt: expiresAt,
      },
    });
  } catch (err) {
    logger.error(
      {
        error: err,
        attributes: {
          userId: userId,
        },
      },
      "Failed to upsert session token",
    );
    return null;
  }
}
