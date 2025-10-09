import {
    BadRequestError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { z } from "zod";
import { procedure } from "../../router.mjs";

const streamInputSchema = z.object({
  conversationId: z.string().nullable(),
  message: z.string().nullable(),
});

export const stream = procedure
  .input(streamInputSchema)
  .subscription(async function* ({ input, ctx }) {
    if (!ctx.auth.user) {
      throw new UnauthorizedError();
    }

    const { conversationId, message } = input;

    if (!conversationId || !message) {
      throw new BadRequestError("Invalid input.");
    }

    // Stream the agent response
    for await (const chunk of ctx.service.agent.stream(
      ctx,
      ctx.auth.user.id,
      conversationId,
      message
    )) {
      switch (chunk.type) {
        case "CHUNK":
          yield { type: "CHUNK", text: chunk.data };
          break;
        case "COMPLETE":
          yield { type: "COMPLETE" };
          break;
        case "ERROR":
          yield { type: "ERROR" };
          break;
      }
    }
  });
