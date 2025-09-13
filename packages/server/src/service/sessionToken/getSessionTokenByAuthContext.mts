import type { Context } from "../../context.mjs";

export async function getSessionTokenByAuthContext(ctx: Context) {
  if (!ctx.auth.user) {
    return null;
  }

  const userId = ctx.auth.user.id;
  const clerkUser = await ctx.datasource.clerk.getUserById(
    ctx.auth.user.authId,
  );
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  const token = await ctx.datasource.quiltt.createSessionToken(userId, email);

  if (!token) {
    return null;
  }

  return {
    token: token.token,
  };
}
