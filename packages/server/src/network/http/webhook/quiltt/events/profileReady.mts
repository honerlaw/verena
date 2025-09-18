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

  const user = await ctx.database.user.getByConnectionIdForWebhooks(
    event.record.id,
  );
  if (!user) {
    ctx.logger.error({ attributes: { event } }, "User not found");
    return;
  }

  await ctx.database.connection.updateStatus(
    user.id,
    conId,
    ConnectionStatus.ENRICHED,
  );

  const connection = await ctx.database.connection.getById(user.id, conId);
  if (!connection) {
    return;
  }

  const sessionToken =
    await ctx.service.sessionToken.getSessionTokenByConnection(
      ctx,
      user.id,
      conId,
    );
  if (!sessionToken) {
    return;
  }

  await ctx.service.root.updateAllTransactions(
    ctx,
    user.id,
    sessionToken.token,
  );
}
