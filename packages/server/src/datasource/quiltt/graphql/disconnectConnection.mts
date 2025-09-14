import { type Logger } from "@onerlaw/framework/backend/logger";
import { type QuilttGraphQLClient } from "./client.mjs";
import {
  ConnectionDisconnectDocument,
  type ConnectionDisconnectMutation,
  type ConnectionDisconnectMutationVariables,
} from "../../../generated/graphql.js";

export async function disconnectConnection(
  logger: Logger,
  graphqlClient: QuilttGraphQLClient,
  connectionId: string,
): Promise<boolean> {
  try {
    const variables: ConnectionDisconnectMutationVariables = {
      id: connectionId,
    };

    const result = await graphqlClient.query<
      ConnectionDisconnectMutation,
      ConnectionDisconnectMutationVariables
    >(ConnectionDisconnectDocument, variables);

    if (result.error) {
      logger.error(
        {
          error: result.error,
          attributes: {
            connectionId,
          },
        },
        "GraphQL error while disconnecting connection",
      );
      return false;
    }

    if (!result.data?.connectionDisconnect) {
      logger.warn(
        {
          attributes: {
            connectionId,
            result: result.data,
          },
        },
        "No connectionDisconnect data in GraphQL response",
      );
      return false;
    }
    
    return true
  } catch (error) {
    logger.error(
      {
        error,
        attributes: {
          connectionId,
        },
      },
      "Error disconnecting connection",
    );
    return false;
  }
}
