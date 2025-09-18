import { type Logger } from "@onerlaw/framework/backend/logger";
import { type OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export async function completion(
  logger: Logger,
  client: OpenAI,
  messages: ChatCompletionMessageParam[],
  tokens: number = 20,
  temperature: number = 0.1,
): Promise<string | null> {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: tokens,
      temperature: temperature,
    });

    return completion.choices[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    logger.error(
      { error, tags: ["datasource", "openai", "conversation", "completion"] },
      "Error generating chat completion",
    );
    return null;
  }
}
