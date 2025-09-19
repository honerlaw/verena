import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";

// @todo make this dynamic based on email of the user potentially
// so that we can have "sandbox" users in production for app store testing
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox!,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
      "PLAID-SECRET": process.env.PLAID_SECRET!,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
