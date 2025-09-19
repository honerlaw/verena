import type { ItemRemoveResponse, PlaidApi } from "plaid";
import type { Logger } from "@onerlaw/framework/backend/logger";

export const remove = async function (
  logger: Logger,
  plaidApi: PlaidApi,
  accessToken: string,
): Promise<ItemRemoveResponse | null> {
  try {
    const response = await plaidApi.itemRemove({
      access_token: accessToken,
    });
    return response.data;
  } catch (err) {
    logger.error(
      {
        error: err,
        tags: ["datasource", "plaid", "item", "remove"],
      },
      "Failed to remove item",
    );
    return null;
  }
};
