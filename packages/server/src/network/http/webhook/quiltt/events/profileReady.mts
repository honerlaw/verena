import type { Context } from "../../../../../context.mjs";
import { ConnectionStatus } from "../../../../../util/database.mjs";
import type { ProfileEvent } from "../types.mjs";

export async function profileReady(ctx: Context, event: ProfileEvent) {
  // connectionId is available in the metadata of the profile ready event
  const conId = event.metadata.connectionId;
  if (!conId) {
    ctx.logger.error(
      {
        attributes: { conId },
      },
      "Connection ID not found in profile ready event",
    );
    return;
  }

  await ctx.database.connection.updateStatus(conId, ConnectionStatus.ENRICHED);

  const connection = await ctx.database.connection.getById(conId);
  if (!connection) {
    return;
  }

  const sessionToken =
    await ctx.service.sessionToken.getSessionTokenByConnection(ctx, conId);
  if (!sessionToken) {
    return;
  }

  await ctx.service.root.updateAllTransactions(
    ctx,
    connection.user.id,
    sessionToken.token,
  );
}
