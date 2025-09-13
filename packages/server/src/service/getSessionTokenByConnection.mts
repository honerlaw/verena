import type { Context } from "../context.mjs";
import type { SessionToken } from "../datasource/quiltt/types.js";

export async function getSessionTokenByConnection(
  ctx: Context,
  connectionId: string,
): Promise<SessionToken | null> {
  const connection = await ctx.database.connection.getById(connectionId);

  if (!connection || !connection.user.quilttUserId) {
    ctx.logger.error(
      {
        attributes: {
          userId: connection?.user.quilttUserId,
          connectionId,
        },
      },
      "Connection not found",
    );
    return null;
  }

  const sessionToken = await ctx.datasource.quiltt.createSessionToken(
    connection.user.quilttUserId,
  );
  if (!sessionToken) {
    ctx.logger.error(
      {
        attributes: { connectionId },
      },
      "Failed to create session token",
    );
    return null;
  }

  return sessionToken;
}
