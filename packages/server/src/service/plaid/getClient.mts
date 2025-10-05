import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";
import { UserType } from "../../generated/prisma/index.js";
import type { Context } from "../../context.mjs";
import { getConfig } from "../../util/config.mjs";
import { getClientBasePath } from "./getClientBasePath.mjs";

export async function getClient(ctx: Context): Promise<PlaidApi> {
  const basePath = await getClientBasePath(ctx);

  // if the user is not null and the user type is not set yet, update the user in prisma
  if (ctx.auth.user !== null && ctx.auth.user.userType === null) {
    await ctx.database.user.setUserType(
      ctx.auth.user.id,
      basePath === PlaidEnvironments.sandbox!
        ? UserType.SANDBOX
        : UserType.PRODUCTION,
    );
  }

  const isProduction = basePath === PlaidEnvironments.production!;

  const configuration = new Configuration({
    basePath: basePath,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": await getConfig("PLAID_CLIENT_ID"),
        "PLAID-SECRET": isProduction
          ? await getConfig("PLAID_SECRET")
          : await getConfig("PLAID_SECRET_SANDBOX"),
      },
    },
  });

  return new PlaidApi(configuration);
}
