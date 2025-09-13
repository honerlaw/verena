import type { GQLTransaction } from "../../datasource/quiltt/graphql/getAllTransactions.mjs";
import {
  type DBClient,
  type Transaction as DBTransaction,
} from "../../util/database.mjs";
import { type Logger } from "@onerlaw/framework/backend/logger";

export async function upsert(
  logger: Logger,
  client: DBClient,
  userId: string,
  transactions: GQLTransaction[],
): Promise<DBTransaction[] | null> {
  if (transactions.length === 0) {
    logger.info("No transactions to upsert");
    return [];
  }

  try {
    return await client.$transaction(
      transactions
        .filter((t) => t !== null && t !== undefined)
        .map((transactionData) => {
          return client.transaction.upsert({
            where: {
              quilttTransactionId: transactionData.id,
            },
            create: {
              userId: userId,
              quilttTransactionId: transactionData.id,
              transaction: transactionData,
            },
            update: {
              transaction: transactionData,
            },
          });
        }),
    );
  } catch (err) {
    logger.error(
      {
        error: err,
        attributes: {
          transactionCount: transactions.length,
          transactionIds: transactions.map((t) => t?.id),
        },
      },
      "Failed to upsert transactions",
    );
    return null;
  }
}
