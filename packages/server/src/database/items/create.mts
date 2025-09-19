import { type Logger } from "@onerlaw/framework/backend/logger";
import { type DBClient } from "../../util/database.mjs";

export const create = async function (
  logger: Logger,
  client: DBClient,
  userId: string,
  itemId: string,
  token: string,
) {
  try {
    return await client.item.create({
      data: { userId, itemId, token },
    });
  } catch (err) {
    logger.error(
      { error: err, tags: ["database", "items", "create"] },
      "Failed to create item",
    );
    return null;
  }
};
