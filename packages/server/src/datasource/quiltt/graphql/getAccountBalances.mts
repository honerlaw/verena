import { type Logger } from "@onerlaw/framework/backend/logger";
import { type QuilttGraphQLClient } from "./client.mjs";
import {
  GetBalancesDocument,
  type GetBalancesQuery,
  type GetBalancesQueryVariables,
} from "../../../generated/graphql.js";

export type GQLAccount = NonNullable<GetBalancesQuery["accounts"]>[number];

export async function getAccountBalances(
  logger: Logger,
  graphqlClient: QuilttGraphQLClient,
): Promise<GQLAccount[] | null> {
  try {
    const result = await graphqlClient.query<
      GetBalancesQuery,
      GetBalancesQueryVariables
    >(GetBalancesDocument, null);

    if (result.error) {
      logger.error(
        {
          error: result.error,
        },
        "GraphQL error while fetching account balances",
      );
      return null;
    }

    if (!result.data?.accounts) {
      logger.warn(
        {
          attributes: {
            result: result.data,
          },
        },
        "No accounts data in GraphQL response",
      );
      return [];
    }

    // Filter out any null accounts and return as GQLAccount[]
    return result.data.accounts.filter((account) => account !== null);
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Error fetching account balances",
    );
    return null;
  }
}
