import { UnauthorizedError } from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";

export const list = procedure.query(async ({ ctx }) => {
  if (!ctx.auth.user) {
    throw new UnauthorizedError();
  }

  const conversations = await ctx.database.conversation.list(ctx.auth.user.id);

  if (!conversations || conversations.length === 0) {
    return {
      conversations: [],
    };
  }

  return {
    conversations: conversations.map((conversation) => ({
      id: conversation.id,
      conversationId: conversation.openaiConversationId,
      title: conversation.title || "New Conversation",
    })),
  };
});
