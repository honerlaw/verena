import { run } from "@openai/agents";
import type { Context } from "../../context.mjs";

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
