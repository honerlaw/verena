import { type Logger } from "@onerlaw/framework/backend/logger";
import { type QuilttGraphQLClient } from "./client.mjs";
import {
  GetTransactionsDocument,
  type GetTransactionsQuery,
  type GetTransactionsQueryVariables,
} from "../../../generated/graphql.js";

export type GQLTransaction = NonNullable<
  NonNullable<
    NonNullable<GetTransactionsQuery["transactions"]>["edges"]
  >[number]
>["node"];

export async function getMostRecentTransactions(
  logger: Logger,
  graphqlClient: QuilttGraphQLClient,
): Promise<GQLTransaction[] | null> {
  try {

    const result = await graphqlClient.query<
      GetTransactionsQuery,
      GetTransactionsQueryVariables
    >(GetTransactionsDocument, null);

    if (result.error) {
      logger.error(
        {
          error: result.error,
        },
        "GraphQL error while fetching most recent transactions",
      );
      return null;
    }

    if (!result.data?.transactions) {
      logger.error(
        {
          attributes: {
            result: result.data,
          },
        },
        "No transactions data in GraphQL response",
      );
      return null;
    }

    const { transactions } = result.data;
    const { edges } = transactions;

    const recentTransactions: GQLTransaction[] = edges
      ? edges
          .filter(
            (edge): edge is NonNullable<typeof edge> => edge?.node != null,
          )
          .map((edge) => edge.node!)
      : [];

    return recentTransactions;
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Error fetching most recent transactions",
    );
    return null;
  }
}
