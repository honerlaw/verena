import {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";
import { z } from "zod";

const inputSchema = z.object({
  conversationId: z.string(),
});

export const remove = procedure
  .input(inputSchema)
  .mutation(async ({ input, ctx }) => {
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

    // Remove from OpenAI
    const openaiResult =
      await ctx.datasource.openai.conversation.remove(conversationId);

    if (!openaiResult) {
      throw new InternalServerError(
        "Failed to remove conversation from OpenAI",
      );
    }

    // Remove from database
    const dbResult = await ctx.database.conversation.remove(
      conversationId,
      userId,
    );

    if (!dbResult) {
      throw new InternalServerError(
        "Failed to remove conversation from database",
      );
    }

    return {
      success: true,
    };
  });
