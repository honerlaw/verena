import type { Transaction } from "plaid";
import type { Context } from "../../context.mjs";
import { type ItemTransaction } from "../../util/database.mjs";

type TransactionWithDecryptedPayload = Omit<ItemTransaction, "transaction"> & {
  transaction: Transaction;
};

export async function getAll(
  ctx: Context,
): Promise<TransactionWithDecryptedPayload[] | null> {
  if (!ctx.auth.user) {
    ctx.logger.error(
      {
        tags: ["service", "transactions", "getAll"],
      },
      "User not found",
    );
    return null;
  }

  const dek = await ctx.service.encryption.getDEK(
    ctx,
    ctx.service.encryption.DEKIdentifier.TRANSACTIONS,
  );

  const transactions = await ctx.database.items.transactions.getAllByUserID(
    ctx.auth.user.id,
  );

  return (
    transactions?.map(
      (transaction: ItemTransaction): TransactionWithDecryptedPayload => {
        return {
          ...transaction,
          transaction: JSON.parse(
            dek.decrypt(transaction.transaction),
          ) as Transaction,
        };
      },
    ) || null
  );
}
