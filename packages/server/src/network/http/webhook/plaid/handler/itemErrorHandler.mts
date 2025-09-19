import { type ItemErrorWebhook } from "plaid";
import type { WebhookHandler } from "../type.mjs";

export const itemErrorHandler: WebhookHandler<ItemErrorWebhook> = async (
  hook,
  ctx,
) => {
  if (hook.error?.error_code !== "ITEM_LOGIN_REQUIRED") {
    ctx.logger.warn(
      {
        attributes: {
          webhook: hook,
        },
      },
      "Unhandled item error webhook",
    );
    return false;
  }

  const updated = await ctx.database.items.update(
    ctx.auth.user!.id,
    hook.item_id,
    "RECONNECT",
  );

  return updated !== null;
};
