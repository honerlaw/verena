import {
  BadRequestError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";

export const create = procedure.mutation(async ({ ctx }) => {
  if (ctx.auth.user === null) {
    throw new UnauthorizedError();
  }

  const user = await ctx.datasource.clerk.getUserById(ctx.auth.user.authId);
  const email = user?.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new BadRequestError("No email address found.");
  }

  // otherwise normal link mode
  const result = await ctx.datasource.plaid.token.create(
    ctx.auth.user.id,
    email,
    null,
  );

  return {
    token: result,
  };
});
