import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";
import { UserType } from "../../generated/prisma/index.js";
import type { Context } from "../../context.mjs";
import { getConfig } from "../../util/config.mjs";

async function getBasePath(ctx: Context) {
  const NODE_ENV = await getConfig("NODE_ENV", "production");
  if (NODE_ENV === "development" || NODE_ENV === "test") {
    return PlaidEnvironments.sandbox!;
  }

  // default to produciton if not user
  if (ctx.auth.user === null) {
    return PlaidEnvironments.production!;
  }

  // if they have a user type defined use that
  /*if (ctx.auth.user.userType !== null) {
    ctx.logger.info(
      { attributes: { userType: ctx.auth.user.userType } },
      "Getting Plaid client for specific user",
    );

    switch (ctx.auth.user.userType) {
      case UserType.SANDBOX:
        return PlaidEnvironments.sandbox!;
      case UserType.PRODUCTION:
        return PlaidEnvironments.production!;
    }
  }*/

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

export async function getClient(ctx: Context): Promise<PlaidApi> {
  const basePath = await getBasePath(ctx);

  ctx.logger.info({ attributes: { basePath } }, "Getting Plaid client");

  // if the user is not null and the user type is not set yet, update the user in prisma
  if (ctx.auth.user !== null) {
    await ctx.database.user.setUserType(
      ctx.auth.user.id,
      basePath === PlaidEnvironments.sandbox!
        ? UserType.SANDBOX
        : UserType.PRODUCTION,
    );
  }

  const configuration = new Configuration({
    basePath: basePath,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": await getConfig("PLAID_CLIENT_ID"),
        "PLAID-SECRET": await getConfig("PLAID_SECRET"),
      },
    },
  });

  return new PlaidApi(configuration);
}
