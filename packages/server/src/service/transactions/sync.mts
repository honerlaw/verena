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
  const item = items.find((item) => item.id === itemId);

  if (!item) {
    ctx.logger.error(
      {
        tags: ["service", "transactions", "sync"],
      },
      "Item not found",
    );
    return false;
  }

  // okay so what information do we get?
  // we need to know the access token and the next cursor
  // so we need to know the item id
  // then from there we sync with that information
  // and then we can update the transactions in our database

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

  for (const transaction of added) {
    const result = await ctx.database.items.transactions.add(
      ctx.auth.user.id,
      item.id,
      transaction.transaction_id,
      Buffer.from(JSON.stringify(transaction)),
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
      Buffer.from(JSON.stringify(transaction)),
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
    item.id,
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

  return true;
}
