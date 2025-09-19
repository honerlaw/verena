import type { Logger } from "@onerlaw/framework/backend/logger";
import type { PlaidApi } from "plaid";

export type ExchangeTokenResponse = {
  token: string;
  itemId: string;
};

export const exchange = async function (
  logger: Logger,
  plaidApi: PlaidApi,
  publicToken: string,
): Promise<{ token: string; itemId: string } | null> {
  try {
    const token = await plaidApi.itemPublicTokenExchange({
      public_token: publicToken,
    });
    return {
      token: token.data.access_token,
      itemId: token.data.item_id,
    };
  } catch (err) {
    logger.error(
      {
        error: err,
        tags: ["datasource", "plaid", "exchangeToken"],
      },
      "Failed to exchange public token",
    );
    return null;
  }
};
