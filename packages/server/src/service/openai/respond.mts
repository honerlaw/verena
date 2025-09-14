import { run } from "@openai/agents";
import type { Context } from "../../context.mjs";

// so I might need to create an abstraction here around the `openai.conversations.create()`
// essentially we would create a new conversation (if we don't have one in our database)
// for the user and then use that conversation id to run the agent
// this should hopefully allow us to restore conversations and toggle between them
// if needed (see https://platform.openai.com/docs/api-reference/conversations/list-items)
export async function respond(
  context: Context,
  message: string,
): Promise<string | null> {
  try {
    const result = await run(context.service.agent.Agent, message, {
      context,
    });

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
