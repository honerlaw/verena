import type { Context } from "../../context.mjs";

export async function getGraphQLClientByAuthContext(ctx: Context) {
  const sessionToken =
    await ctx.service.sessionToken.getSessionTokenByAuthContext(ctx);
  if (!sessionToken) {
    return null;
  }
  return ctx.datasource.quilttGraphQL.createQuilttGraphQLClient(
    sessionToken.token,
  );
}
