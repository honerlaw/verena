import { type Logger } from "@onerlaw/framework/backend/logger";
import { type QuilttGraphQLClient } from "./client.mjs";
import {
  GetConnectionsDocument,
  type GetConnectionsQuery,
  type GetConnectionsQueryVariables,
} from "../../../generated/graphql.js";

type GQLConnection = NonNullable<GetConnectionsQuery["connections"]>[number];

export async function getAllConnections(
  logger: Logger,
  graphqlClient: QuilttGraphQLClient,
): Promise<GQLConnection[] | null> {
  try {
    const result = await graphqlClient.query<
      GetConnectionsQuery,
      GetConnectionsQueryVariables
    >(GetConnectionsDocument, {});

    if (result.error) {
      logger.error(
        {
          error: result.error,
        },
        "GraphQL error while fetching connections",
      );
      return null;
    }

    if (!result.data?.connections) {
      logger.warn(
        {
          attributes: {
            result: result.data,
          },
        },
        "No connections data in GraphQL response",
      );
      return [];
    }

    // Filter out any null connections and return as Connection[]
    return result.data.connections.filter((connection) => connection !== null);
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Error fetching all connections",
    );
    return null;
  }
}
