import {
  BadRequestError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";
import { z } from "zod";

const CreateInput = z.object({
  itemId: z.string().optional().nullable(),
});

export const create = procedure
  .input(CreateInput)
  .mutation(async ({ ctx, input }) => {
    if (ctx.auth.user === null) {
      throw new UnauthorizedError();
    }

    const user = await ctx.datasource.clerk.getUserById(ctx.auth.user.authId);
    const email = user?.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new BadRequestError("No email address found.");
    }

    const items = await ctx.database.items.getByUserId(ctx.auth.user.id);
    const item = items?.find((item) => item.itemId === input.itemId);

    // we only care to create an "update" link token if an item id was provided
    if (typeof input.itemId === "string" && !item) {
      throw new BadRequestError("Item not found.");
    }

    // otherwise normal link mode
    const result = await ctx.datasource.plaid.token.create(
      ctx.auth.user.id,
      email,
      item?.token ?? null,
    );

    return {
      token: result,
    };
  });
