import type { Request, Response } from "express";
import { createHmac } from "crypto";
import { ConnectionStatus } from "../../../../util/database.mjs";
import type { WebhookPayload } from "./types.mjs";
import { historical } from "./events/historical.mjs";
import { profileReady } from "./events/profileReady.mjs";

const QUILTT_WEBHOOK_SECRET = process.env.QUILTT_WEBHOOK_SECRET!;
const QUILTT_WEBHOOK_VERSION = 1;
const QUILTT_WEBHOOK_WINDOW = 300; // Five minutes

export const quiltt = async (req: Request, res: Response) => {
  const timestamp = req.header("Quiltt-Timestamp");
  if (
    !timestamp ||
    Date.now() / 1000 - Number(timestamp) > QUILTT_WEBHOOK_WINDOW
  ) {
    return res.status(204).send();
  }

  const payload = JSON.stringify(req.body);
  const signature = createHmac("sha256", QUILTT_WEBHOOK_SECRET)
    .update(`${QUILTT_WEBHOOK_VERSION}${timestamp}${payload}`)
    .digest("base64");

  if (req.header("Quiltt-Signature") !== signature) {
    return res.status(204).send();
  }

  const webhook: WebhookPayload = req.body;

  await Promise.all(
    webhook.events.map(async (event) => {
      switch (event.type) {
        case "connection.synced.successful.initial": {
          const user =
            await req.serverContext.database.user.getByConnectionIdForWebhooks(
              event.record.id,
            );
          if (!user) {
            req.serverContext.logger.error(
              { attributes: { event } },
              "User not found",
            );
            return;
          }
          await req.serverContext.database.connection.updateStatus(
            user.id,
            event.record.id,
            ConnectionStatus.SYNCED_INITIAL,
          );
          break;
        }
        case "connection.synced.successful.historical": {
          await historical(req.serverContext, event);
          break;
        }
        case "profile.ready": {
          await profileReady(req.serverContext, event);
          break;
        }
        case "connection.disconnected": {
          const user =
            await req.serverContext.database.user.getByConnectionIdForWebhooks(
              event.record.id,
            );
          if (!user) {
            req.serverContext.logger.error(
              { attributes: { event } },
              "User not found",
            );
            return;
          }
          await req.serverContext.database.connection.updateStatus(
            user.id,
            event.record.id,
            ConnectionStatus.DISCONNECTED,
          );
          break;
        }
        case "connection.synced.errored.repairable": {
          const user =
            await req.serverContext.database.user.getByConnectionIdForWebhooks(
              event.record.id,
            );
          if (!user) {
            req.serverContext.logger.error(
              { attributes: { event } },
              "User not found",
            );
            return;
          }
          await req.serverContext.database.connection.updateStatus(
            user.id,
            event.record.id,
            ConnectionStatus.RECONNECT,
          );
          break;
        }
        case "connection.synced.errored.institution": {
          const user =
            await req.serverContext.database.user.getByConnectionIdForWebhooks(
              event.record.id,
            );
          if (!user) {
            req.serverContext.logger.error(
              { attributes: { event } },
              "User not found",
            );
            return;
          }
          await req.serverContext.database.connection.updateStatus(
            user.id,
            event.record.id,
            ConnectionStatus.INSTITUTION_ERROR,
          );
          break;
        }
        default:
          req.serverContext.logger.warn(
            { attributes: { event } },
            "Unknown event type",
          );
          break;
      }
    }),
  );
};
