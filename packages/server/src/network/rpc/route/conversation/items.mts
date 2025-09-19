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

    const messages = items.data
      .filter((item) => item.type === "message")
      .map((item) => {
        return {
          id: item.id,
          role: item.role,
          content: item.content,
        };
      });

    // Dedupe messages by id
    const filteredItems = messages.filter(
      (message, index, array) =>
        array.findIndex((m) => m.id === message.id) === index,
    );

    // Further filter out messages with identical content
    const uniqueContentItems = filteredItems.filter(
      (message, index, array) =>
        array.findIndex(
          (m) => JSON.stringify(m.content) === JSON.stringify(message.content),
        ) === index,
    );

    return {
      conversationId,
      items: uniqueContentItems.reverse(),
    };
  });
