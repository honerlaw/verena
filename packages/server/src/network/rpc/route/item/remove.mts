import { procedure } from "../../router.mjs";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { z } from "zod";

const RemoveInput = z.object({
  itemId: z.string(),
});

export const remove = procedure
  .input(RemoveInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.auth.user) {
      throw new UnauthorizedError();
    }

    const items = await ctx.database.items.getByUserId(ctx.auth.user.id);
    const item = items?.find((item) => item.itemId === input.itemId);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const removed = await ctx.datasource.plaid.item.remove(item.token);
    if (!removed) {
      throw new InternalServerError("Failed to remove item");
    }

    return {
      success: true,
    };
  });
