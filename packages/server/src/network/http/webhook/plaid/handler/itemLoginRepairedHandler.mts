import { type PendingExpirationWebhook } from "plaid";
import type { WebhookHandler } from "../type.mjs";

export const itemLoginRepairedHandler: WebhookHandler<
  PendingExpirationWebhook
> = async (hook, ctx) => {
  const updated = await ctx.database.items.update(
    ctx.auth.user!.id,
    hook.item_id,
    "SYNCED",
  );

  return updated !== null;
};
