import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";

export const remove = procedure.mutation(async ({ ctx }) => {
  if (!ctx.auth.user) {
    throw new UnauthorizedError();
  }

  const removedUser = await ctx.database.user.remove(ctx.auth.user.id);

  if (!removedUser) {
    throw new InternalServerError("User not found or failed to remove.");
  }

  // delete all of the user's data from quiltt as well
  await ctx.datasource.quiltt.deleteProfile(ctx.auth.user.id);

  return {
    success: true,
    user: {
      id: removedUser.id,
      createdAt: removedUser.createdAt,
    },
  };
});
