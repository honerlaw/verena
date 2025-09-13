import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";

export const getSessionToken = procedure.query(async ({ ctx }) => {
  if (!ctx.auth.user) {
    throw new UnauthorizedError();
  }

  const token =
    await ctx.service.sessionToken.getSessionTokenByAuthContext(ctx);

  if (!token) {
    throw new InternalServerError("Failed to create session token");
  }

  return {
    token: token.token,
  };
});
