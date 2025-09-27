import { CountryCode, type PlaidApi, Products } from "plaid";
import { type Logger } from "@onerlaw/framework/backend/logger";
import { getConfig } from "../../../util/config.mjs";

export type LinkTokenResponse = {
  link_token: string;
  expiration: string;
  request_id: string;
};

export async function create(
  logger: Logger,
  client: PlaidApi,
  userId: string,
  emailAddress: string,
  accessToken: string | null,
): Promise<LinkTokenResponse | null> {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: userId,
        email_address: emailAddress,
      },
      access_token: accessToken,
      client_name: "Verena",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
      webhook: `${await getConfig("WEBHOOK_BASE_URL")}/api/webhook/plaid`,
      transactions: {
        days_requested: 730, // 2 years, max data retention
      },
    });

    return {
      link_token: response.data.link_token,
      expiration: response.data.expiration,
      request_id: response.data.request_id,
    };
  } catch (error) {
    logger.error(
      {
        error,
        tags: ["datasource", "plaid", "createLinkToken"],
      },
      "Error creating link token",
    );
    return null;
  }
}
