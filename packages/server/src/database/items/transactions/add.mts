import type { Logger } from "@onerlaw/framework/backend/logger";
import type { DBClient } from "../../../util/database.mjs";

export async function add(
  logger: Logger,
  client: DBClient,
  userId: string,
  itemId: string,
  transactionId: string,
  transaction: Buffer,
) {
  try {
    return await client.itemTransaction.create({
      data: {
        transactionId,
        itemId,
        userId,
        transaction,
      },
    });
  } catch (error) {
    logger.error(
      { error, tags: ["database", "items", "transactions", "add"] },
      "Failed to add item transaction",
    );
    return null;
  }
}
