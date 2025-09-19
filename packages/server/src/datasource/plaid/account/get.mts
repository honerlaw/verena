import type { AccountBase, PlaidApi } from "plaid";
import type { Logger } from "@onerlaw/framework/backend/logger";

export const get = async function (
  logger: Logger,
  plaidApi: PlaidApi,
  accessToken: string,
): Promise<AccountBase[] | null> {
  try {
    const accounts = await plaidApi.accountsGet({
      access_token: accessToken,
    });
    return accounts.data.accounts;
  } catch (err) {
    logger.error(
      {
        error: err,
        tags: ["datasource", "plaid", "account", "get"],
      },
      "Failed to get accounts",
    );
    return null;
  }
};
