import type { Context } from "../../context.mjs";

export async function sync(ctx: Context, itemId: string): Promise<boolean> {
  if (!ctx.auth.user) {
    ctx.logger.error(
      {
        tags: ["service", "transactions", "sync"],
      },
      "User not found",
    );
    return false;
  }

  const items = await ctx.database.items.getByUserId(ctx.auth.user.id);
  const item = items?.find((item) => item.itemId === itemId);

  if (!item) {
    ctx.logger.error(
      {
        tags: ["service", "transactions", "sync"],
      },
      "Item not found",
    );
    return false;
  }

  const response = await ctx.datasource.plaid.transactions.sync(
    item.token,
    item.nextCursor,
  );

  if (!response) {
    ctx.logger.error(
      {
        tags: ["service", "transactions", "sync"],
      },
      "Failed to sync transactions",
    );
    return false;
  }

  const { added, modified, removed, nextCursor } = response;

  const failures: string[] = [];

  // get the DEK to encrypt the transaction payloads going into the database
  const dek = await ctx.service.encryption.getDEK(
    ctx,
    ctx.service.encryption.DEKIdentifier.TRANSACTIONS,
  );

  for (const transaction of added) {
    const result = await ctx.database.items.transactions.add(
      ctx.auth.user.id,
      item.id,
      transaction.transaction_id,
      dek.encrypt(JSON.stringify(transaction)),
    );
    if (!result) {
      failures.push(transaction.transaction_id);
    }
  }

  for (const transaction of modified) {
    const result = await ctx.database.items.transactions.update(
      ctx.auth.user.id,
      item.id,
      transaction.transaction_id,
      dek.encrypt(JSON.stringify(transaction)),
    );
    if (!result) {
      failures.push(transaction.transaction_id);
    }
  }

  for (const transaction of removed) {
    const result = await ctx.database.items.transactions.remove(
      ctx.auth.user.id,
      item.id,
      transaction.transaction_id,
    );
    if (!result) {
      failures.push(transaction.transaction_id);
    }
  }

  if (failures.length > 0) {
    ctx.logger.error(
      {
        tags: ["service", "transactions", "sync"],
        attributes: {
          failures,
        },
      },
      "Failed to add some transactions",
    );
    return false;
  }

  // if everything succeeded, then we can update the next cursor
  const success = await ctx.database.items.update(
    ctx.auth.user.id,
    itemId,
    item.status,
    nextCursor ?? null,
  );
  if (!success) {
    ctx.logger.error(
      {
        tags: ["service", "transactions", "sync"],
      },
      "Failed to update next cursor for item",
    );
    return false;
  }

  // finally update the item status to SYNCED
  const updated = await ctx.database.items.update(
    ctx.auth.user!.id,
    itemId,
    "SYNCED",
  );

  return updated !== null;
}
