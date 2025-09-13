import type { Context } from "../context.mjs";

export async function updateAllTransactions(
  ctx: Context,
  userId: string,
  sessionToken: string,
) {
  const client =
    ctx.datasource.quilttGraphQL.createQuilttGraphQLClient(sessionToken);

  const transactions =
    await ctx.datasource.quilttGraphQL.getAllTransactions(client);

  await ctx.database.transaction.upsert(userId, transactions);
}
