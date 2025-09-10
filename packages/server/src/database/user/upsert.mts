import { type DBClient, type User } from "../../util/database.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function upsert(
  logger: Logger,
  client: DBClient,
  authId: string,
): Promise<User | null> {
  try {
    return await client.user.upsert({
      where: {
        authId: authId,
      },
      create: {
        authId: authId,
      },
      update: {},
    });
  } catch (err) {
    logger.error(
      {
        error: err,
      },
      "Failed to upsert user",
    );
    return null;
  }
}
