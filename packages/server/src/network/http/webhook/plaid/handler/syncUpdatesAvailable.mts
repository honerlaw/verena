import { type SyncUpdatesAvailableWebhook } from "plaid";
import { type WebhookHandler } from "../type.mjs";

export const syncUpdatesAvailableHandler: WebhookHandler<
  SyncUpdatesAvailableWebhook
> = async (hook, ctx) => {
  const user = await ctx.database.user.getByItemIdForWebhooks(hook.item_id);

  if (!user) {
    ctx.logger.warn(
      {
        attributes: {
          item_id: hook.item_id,
        },
      },
      `Failed to find user id for item`,
    );
    return false;
  }

  await ctx.service.transactions
    .sync(
      {
        ...ctx,
        auth: {
          user,
        },
      },
      hook.item_id,
    )
    .catch((error) => {
      ctx.logger.error(
        {
          attributes: {
            error,
          },
        },
        `Failed to sync transactions`,
      );
    });

  return true;
};
