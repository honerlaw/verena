import type { Context } from "../../../../../context.mjs";
import { ConnectionStatus } from "../../../../../util/database.mjs";
import type { ConnectionEvent } from "../types.mjs";

export const historical = async (ctx: Context, event: ConnectionEvent) => {
  await ctx.database.connection.updateStatus(
    event.record.id,
    ConnectionStatus.SYNCED_HISTORICAL,
  );

  const connection = await ctx.database.connection.getById(event.record.id);
  if (!connection) {
    return;
  }

  const sessionToken = await ctx.service.getSessionTokenByConnection(
    ctx,
    event.record.id,
  );

  if (!sessionToken) {
    return;
  }

  await ctx.service.updateAllTransactions(
    ctx,
    connection.user.id,
    sessionToken,
  );
};
