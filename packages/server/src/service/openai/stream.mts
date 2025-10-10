import { run } from "@openai/agents";
import type { Context } from "../../context.mjs";

type StreamChunk =
  | {
      type: "COMPLETE";
    }
  | {
      type: "ERROR";
    }
  | {
      type: "CHUNK";
      data: string;
    };

/**
 * So a few things, we should not use the conversation API at all basically
 * we should instead leverage the response API.
 */
export async function* stream(
  context: Context,
  userId: string,
  conversationId: string,
  message: string,
): AsyncGenerator<StreamChunk, void, unknown> {
  try {
    // must have a conversation to stream to
    const conversation =
      await context.database.conversation.getByConversationIdForUser(
        conversationId,
        userId,
      );
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // generate a title for the conversation if it doesn't have one
    if (conversation.title === null) {
      const result = await context.datasource.openai.conversation.completion([
        {
          role: "system",
          content:
            "You are a helpful assistant that creates short, descriptive titles for conversations. Generate a concise title (2-6 words) that captures the main topic of the user's message. Return only the title, no quotes or additional text.",
        },
        {
          role: "user",
          content: `Create a title for this message: "${message}"`,
        },
      ]);
      const title = result ?? "New Conversation";
      await context.database.conversation.update(
        userId,
        conversation.openaiConversationId,
        title,
      );
    }

    // respond to the message with streaming
    const result = await run(
      context.service.agent.agents.VerenaAgent,
      message,
      {
        conversationId: conversation.openaiConversationId,
        context,
        stream: true,
      },
    );

    // Convert the streaming result to a text stream and yield chunks
    const textStream = result.toTextStream({ compatibleWithNodeStreams: true });

    // Read from the stream and yield string chunks
    for await (const chunk of textStream) {
      if (chunk instanceof Buffer) {
        yield {
          type: "CHUNK",
          data: chunk.toString(),
        };
      }
    }

    // Wait for the stream to complete
    await result.completed;

    yield {
      type: "COMPLETE",
    };
  } catch (error) {
    context.logger.error(
      {
        error,
        tags: ["service", "openai", "stream"],
      },
      "Error streaming message response",
    );
    yield {
      type: "ERROR",
    };
  }
}
