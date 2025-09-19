import { CountryCode, type PlaidApi, Products } from "plaid";
import { type Logger } from "@onerlaw/framework/backend/logger";

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
      products: [Products.Transactions, Products.Auth],
      country_codes: [CountryCode.Us],
      language: "en",
      redirect_uri: "https://www.verena.app/connect",
      webhook: "https://www.verena.app/api/webhook/plaid",
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
