import type { Context } from "../context.mjs";
import type { SessionToken } from "../datasource/quiltt/types.js";

export async function updateAllTransactions(
  ctx: Context,
  userId: string,
  sessionToken: SessionToken,
) {
  const client = ctx.datasource.quilttGraphQL.createQuilttGraphQLClient(
    sessionToken.token,
  );

  const transactions =
    await ctx.datasource.quilttGraphQL.getAllTransactions(client);

  await ctx.database.transaction.upsert(userId, transactions);
}
