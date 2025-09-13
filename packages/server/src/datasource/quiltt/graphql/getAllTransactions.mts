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

async function fetchTransactionsRecursively(
  logger: Logger,
  graphqlClient: QuilttGraphQLClient,
  cursor: string | undefined,
  accumulatedTransactions: GQLTransaction[],
): Promise<GQLTransaction[]> {
  try {
    const variables: GetTransactionsQueryVariables = cursor
      ? {
          after: cursor,
        }
      : {};

    const result = await graphqlClient.query<
      GetTransactionsQuery,
      GetTransactionsQueryVariables
    >(GetTransactionsDocument, variables);

    if (result.error) {
      logger.error(
        {
          error: result.error,
          attributes: {
            cursor,
            variables,
          },
        },
        "GraphQL error while fetching transactions",
      );
      throw new Error(`GraphQL error: ${result.error.message}`);
    }

    if (!result.data?.transactions) {
      logger.error(
        {
          attributes: {
            cursor,
            result: result.data,
          },
        },
        "No transactions data in GraphQL response",
      );
      throw new Error("No transactions data returned from GraphQL query");
    }

    const { transactions } = result.data;
    const { edges, pageInfo } = transactions;

    const pageTransactions: GQLTransaction[] = edges
      ? edges
          .filter(
            (edge): edge is NonNullable<typeof edge> => edge?.node != null,
          )
          .map((edge) => edge.node!)
      : [];

    const newAccumulatedTransactions = [
      ...accumulatedTransactions,
      ...pageTransactions,
    ];

    // Base case: no more pages
    if (!pageInfo.hasNextPage) {
      return newAccumulatedTransactions;
    }

    // Recursive case: fetch next page
    const nextCursor = pageInfo.endCursor || undefined;

    // if there is no next cursor, we have fetched all transactions
    if (!nextCursor) {
      logger.error(
        {
          attributes: {
            currentTransactionCount: newAccumulatedTransactions.length,
          },
        },
        "No next cursor found but hasNextPage is true",
      );
      return newAccumulatedTransactions;
    }

    return fetchTransactionsRecursively(
      logger,
      graphqlClient,
      nextCursor,
      newAccumulatedTransactions,
    );
  } catch (error) {
    logger.error(
      {
        error,
        attributes: {
          currentTransactionCount: accumulatedTransactions.length,
          cursor,
        },
      },
      "Error fetching all transactions",
    );
    throw error;
  }
}

export async function getAllTransactions(
  logger: Logger,
  graphqlClient: QuilttGraphQLClient,
): Promise<GQLTransaction[]> {
  return fetchTransactionsRecursively(logger, graphqlClient, undefined, []);
}
