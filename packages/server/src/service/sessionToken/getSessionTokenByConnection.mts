import type { Context } from "../../context.mjs";

export async function getSessionTokenByConnection(
  ctx: Context,
  userId: string,
  connectionId: string,
): Promise<{ token: string } | null> {
  const connection = await ctx.database.connection.getById(
    userId,
    connectionId,
  );

  if (!connection) {
    ctx.logger.error(
      {
        attributes: {
          connectionId,
        },
      },
      "Connection not found",
    );
    return null;
  }

  // override the auth user and then fetch with the getSessionTokenByAuthContext
  ctx.auth.user = connection.user;

  return await ctx.service.sessionToken.getSessionTokenByAuthContext(ctx);
}
