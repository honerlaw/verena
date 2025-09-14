import type { Context } from "../../context.mjs";

export async function getSessionTokenByAuthContext(ctx: Context) {
  if (!ctx.auth.user) {
    return null;
  }

  const sessionToken = await ctx.database.sessionToken.getByUserId(
    ctx.auth.user.id,
  );

  // if we already have a token, and there is more than 1 hour remaining
  // go ahead and retun it
  if (sessionToken) {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    if (sessionToken.expiresAt > oneHourFromNow) {
      return {
        token: sessionToken.token,
      };
    }
  }

  // token is considered expired, so create a new one
  const userId = ctx.auth.user.id;
  const clerkUser = await ctx.datasource.clerk.getUserById(
    ctx.auth.user.authId,
  );
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  const token = await ctx.datasource.quiltt.createSessionToken(userId, email);

  if (!token) {
    return null;
  }

  await ctx.database.sessionToken.upsert(
    ctx.auth.user.id,
    token.token,
    new Date(token.expiresAt),
  );

  return {
    token: token.token,
  };
}
