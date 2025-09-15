import { run } from "@openai/agents";
import type { Context } from "../../context.mjs";

export async function respond(
  context: Context,
  conversationId: string,
  message: string,
): Promise<string | null> {
  try {
    // must have a conversation to respond to
    const conversation =
      await context.database.conversation.getByConversationId(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // generate a title for the conversation if it doesn't have one
    if (conversation.title === null) {
      const result = await run(
        context.service.agent.agents.SummaryAgent,
        message,
        {
          context,
        },
      );
      const title = result.finalOutput ?? "New Conversation";
      await context.database.conversation.update(conversationId, title);
    }

    // respond to the message
    const result = await run(
      context.service.agent.agents.VerenaAgent,
      message,
      {
        conversationId,
        context,
      },
    );

    return result.finalOutput ?? null;
  } catch (error) {
    context.logger.error(
      {
        error,
      },
      "Error responding to message",
    );
  }
  return null;
}
