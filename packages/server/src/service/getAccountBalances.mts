import type { Context } from "../context.mjs";

export async function getAccountBalances(context: Context) {
  const sessionToken =
    await context.service.sessionToken.getSessionTokenByAuthContext(context);

  if (!sessionToken) {
    return null;
  }

  const client = context.datasource.quilttGraphQL.createQuilttGraphQLClient(
    sessionToken.token,
  );

  return context.datasource.quilttGraphQL.getAccountBalances(client);
}
