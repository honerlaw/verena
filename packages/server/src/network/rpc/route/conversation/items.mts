import {
  UnauthorizedError,
  NotFoundError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";
import { z } from "zod";

const inputSchema = z.object({
  conversationId: z.string(),
});

export const items = procedure
  .input(inputSchema)
  .query(async ({ input, ctx }) => {
    if (!ctx.auth.user) {
      throw new UnauthorizedError();
    }

    const userId = ctx.auth.user.id;
    const { conversationId } = input;

    // Verify that the conversation exists and belongs to the user
    const conversation =
      await ctx.database.conversation.getByConversationIdForUser(
        conversationId,
        userId,
      );

    if (!conversation) {
      throw new NotFoundError("Conversation not found or access denied");
    }

    // Fetch items from OpenAI
    const items =
      await ctx.datasource.openai.conversation.items(conversationId);

    if (!items) {
      return {
        items: [],
      };
    }

    return {
      items: items.data,
    };
  });
