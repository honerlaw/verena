import type express from "express";
import { syncUpdatesAvailableHandler } from "./handler/syncUpdatesAvailable.mjs";
import { itemErrorHandler } from "./handler/itemErrorHandler.mjs";
import { itemPendingExpirationHandler } from "./handler/itemPendingExpirationHandler.mjs";
import { itemLoginRepairedHandler } from "./handler/itemLoginRepairedHandler.mjs";

/**
 * These are codes that are used for /transactions/get, but this application uses
 * the later api for syncing transactions instead. So we need to ignore these
 * and not report them as an error in the logs
 */
const LEGACY_WEBHOOK_CODES = [
  "TRANSACTIONS_REMOVED",
  "DEFAULT_UPDATE",
  "INITIAL_UPDATE",
  "HISTORICAL_UPDATE",
].map((s) => s.toLowerCase());

// RECURRING_TRANSACTIONS_UPDATE

const HANDLER_MAP: Record<
  string,
  Record<
    string,
    | typeof syncUpdatesAvailableHandler
    | typeof itemErrorHandler
    | typeof itemPendingExpirationHandler
    | typeof itemLoginRepairedHandler
  >
> = {
  item: {
    error: itemErrorHandler,
    pending_expiration: itemPendingExpirationHandler,
    item_repaired: itemLoginRepairedHandler,
  },
  transactions: {
    sync_updates_available: syncUpdatesAvailableHandler,
  },
};

export async function plaidWebhook(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  try {
    const isValidRequest =
      await req.serverContext.datasource.plaid.webhook.validate(
        req.headers["plaid-verification"],
        req.body,
      );
    if (!isValidRequest) {
      res.status(401).json({ status: "unauthorized" });
      return;
    }

    const webhook = req.body;
    const { webhook_type: webhookType, webhook_code: webhookCode } = webhook;
    const type = webhookType.toLowerCase();
    const code = webhookCode.toLowerCase();

    const handler = HANDLER_MAP[type]?.[code];

    if (!handler) {
      // we should not handle these legacy webcodes
      if (LEGACY_WEBHOOK_CODES.includes(code)) {
        res.json({ status: "ok" });
        return;
      }

      req.serverContext.logger.warn(
        {
          attributes: {
            webhook: webhook,
          },
        },
        `Unhandled webhook type`,
      );
      res.json({ status: "ok" });
      return;
    }

    const result = await handler(webhook, req.serverContext);
    if (result) {
      res.json({ status: "ok" });
      return;
    }
    req.serverContext.logger.error(
      {
        attributes: {
          webhook: webhook,
        },
      },
      `Failed to handle webhook`,
    );
    res.status(500).json({ status: "failed" });
  } catch (err) {
    req.serverContext.logger.error(
      {
        error: err,
      },
      `Hard failure when handling webhook`,
    );
    res.status(500).json({ status: "error" });
  }
}
