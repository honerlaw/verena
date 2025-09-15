import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";

export const create = procedure.mutation(async ({ ctx }) => {
  if (!ctx.auth.user) {
    throw new UnauthorizedError();
  }

  const userId = ctx.auth.user.id;

  // Create the conversation in OpenAI using direct imports
  const openaiConversation =
    await ctx.datasource.openai.conversation.create(userId);

  if (!openaiConversation) {
    throw new InternalServerError("Failed to create OpenAI conversation");
  }

  // Store the conversation in the database
  const dbConversation = await ctx.database.conversation.create(
    userId,
    openaiConversation.id,
  );

  if (!dbConversation) {
    throw new InternalServerError("Failed to store conversation in database");
  }

  return {
    conversation: {
      id: dbConversation.id,
      conversationId: dbConversation.openaiConversationId,
    },
  };
});
