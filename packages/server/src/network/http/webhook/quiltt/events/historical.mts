import type { Context } from "../../../../../context.mjs";
import { ConnectionStatus } from "../../../../../util/database.mjs";
import type { ConnectionEvent } from "../types.mjs";

export const historical = async (ctx: Context, event: ConnectionEvent) => {
  const user = await ctx.database.user.getByConnectionIdForWebhooks(
    event.record.id,
  );
  if (!user) {
    ctx.logger.error({ attributes: { event } }, "User not found");
    return;
  }

  await ctx.database.connection.updateStatus(
    user.id,
    event.record.id,
    ConnectionStatus.SYNCED_HISTORICAL,
  );

  const connection = await ctx.database.connection.getById(
    user.id,
    event.record.id,
  );
  if (!connection) {
    return;
  }

  const sessionToken =
    await ctx.service.sessionToken.getSessionTokenByConnection(
      ctx,
      user.id,
      event.record.id,
    );

  if (!sessionToken) {
    return;
  }

  await ctx.service.root.updateAllTransactions(
    ctx,
    user.id,
    sessionToken.token,
  );
};
