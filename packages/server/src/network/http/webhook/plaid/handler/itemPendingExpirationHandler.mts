import { type PendingExpirationWebhook } from "plaid";
import type { WebhookHandler } from "../type.mjs";

export const itemPendingExpirationHandler: WebhookHandler<
  PendingExpirationWebhook
> = async (hook, ctx) => {
  const updated = await ctx.database.items.update(
    ctx.auth.user!.id,
    hook.item_id,
    "RECONNECT",
  );

  return updated !== null;
};
