import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";

export const getSessionToken = procedure.query(async ({ ctx }) => {
  if (!ctx.auth.user) {
    throw new UnauthorizedError();
  }

  const userId = ctx.auth.user.quilttUserId;

  const clerkUser = await ctx.datasource.clerk.getUserById(
    ctx.auth.user.authId,
  );
  const email = clerkUser?.emailAddresses[0]?.emailAddress;

  const token = await ctx.datasource.quiltt.createSessionToken(userId, email);

  if (!token) {
    throw new InternalServerError("Failed to create session token");
  }

  // store the quiltt user id in our database
  await ctx.database.user.upsert(ctx.auth.user.authId, token.userId);

  return {
    token: token.token,
  };
});
