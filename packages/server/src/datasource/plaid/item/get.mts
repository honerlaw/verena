import type { ItemGetResponse, PlaidApi } from "plaid";
import type { Logger } from "@onerlaw/framework/backend/logger";

export const get = async function (
  logger: Logger,
  plaidApi: PlaidApi,
  accessToken: string,
): Promise<ItemGetResponse | null> {
  try {
    const response = await plaidApi.itemGet({
      access_token: accessToken,
    });
    return response.data;
  } catch (err) {
    logger.error(
      {
        error: err,
        tags: ["datasource", "plaid", "item", "get"],
      },
      "Failed to get item information",
    );
    return null;
  }
};