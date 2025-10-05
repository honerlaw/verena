import type { Context } from "../../context.mjs";
import { getConfig } from "../../util/config.mjs";
import { PlaidEnvironments } from "plaid";
import { UserType } from "../../generated/prisma/index.js";

export async function getClientBasePath(ctx: Context) {
  const NODE_ENV = await getConfig("NODE_ENV", "production");
  if (NODE_ENV === "development" || NODE_ENV === "test") {
    return PlaidEnvironments.sandbox!;
  }

  // default to produciton if not user
  if (ctx.auth.user === null) {
    return PlaidEnvironments.production!;
  }

  // if they have a user type defined use that
  if (ctx.auth.user.userType !== null) {
    switch (ctx.auth.user.userType) {
      case UserType.SANDBOX:
        return PlaidEnvironments.sandbox!;
      case UserType.PRODUCTION:
        return PlaidEnvironments.production!;
    }
  }

  // check if they user's email ends with +dev@onerlaw.com
  const clerkUser = await ctx.datasource.clerk.getUserById(
    ctx.auth.user.authId,
  );
  if (
    clerkUser?.emailAddresses[0]?.emailAddress?.endsWith("+dev@onerlaw.com")
  ) {
    return PlaidEnvironments.sandbox!;
  }

  // otherwise use production
  return PlaidEnvironments.production!;
}
