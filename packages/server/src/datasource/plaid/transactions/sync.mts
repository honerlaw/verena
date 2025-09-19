import type {
  PlaidApi,
  RemovedTransaction,
  Transaction,
  TransactionsSyncRequest,
  TransactionsSyncResponse,
} from "plaid";
import type { Logger } from "@onerlaw/framework/backend/logger";

type RecursiveSyncOptions = {
  cursor?: string | undefined;
  count?: number;
};

const recursiveSync = async function (
  logger: Logger,
  plaidApi: PlaidApi,
  accessToken: string,
  options: RecursiveSyncOptions = {},
): Promise<Array<TransactionsSyncResponse | null>> {
  const { cursor, count = 500 } = options;

  const responses: Array<TransactionsSyncResponse | null> = [];

  try {
    const requestPayload: TransactionsSyncRequest = {
      access_token: accessToken,
      count: count,
    };

    if (cursor) {
      requestPayload.cursor = cursor;
    }

    const response = await plaidApi.transactionsSync(requestPayload);

    responses.push(response.data);

    if (response.data.has_more) {
      responses.push(
        ...(await recursiveSync(logger, plaidApi, accessToken, {
          cursor: response.data.next_cursor,
          count: 500,
        })),
      );
    }

    return responses;
  } catch (err) {
    logger.error(
      {
        error: err,
        tags: ["datasource", "plaid", "transactions", "sync"],
      },
      "Failed to sync transactions",
    );
    return [];
  }
};

type SyncResponse = {
  added: Transaction[];
  modified: Transaction[];
  removed: RemovedTransaction[];
  nextCursor: string | undefined;
};

export const sync = async function (
  logger: Logger,
  plaidApi: PlaidApi,
  accessToken: string,
  initialCursor?: string | null,
): Promise<SyncResponse | null> {
  try {
    const responses = await recursiveSync(logger, plaidApi, accessToken, {
      cursor: initialCursor ?? undefined,
      count: 500,
    });

    if (responses.length === 0) {
      logger.warn(
        {
          attributes: {
            initialCursor,
          },
        },
        "No responses from recursive sync",
      );
      return null;
    }

    const nextCursor = responses[responses.length - 1]?.next_cursor;

    return responses.reduce(
      (acc: SyncResponse, response) => {
        if (response) {
          acc.added.push(...response.added);
          acc.modified.push(...response.modified);
          acc.removed.push(...response.removed);
        }
        return acc;
      },
      {
        added: [],
        modified: [],
        removed: [],
        nextCursor,
      },
    );
  } catch (error) {
    logger.error(
      {
        error,
        attributes: {
          initialCursor,
        },
      },
      "Error syncing transactions",
    );
    return null;
  }
};
