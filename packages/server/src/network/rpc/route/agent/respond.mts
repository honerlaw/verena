import {
  InternalServerError,
  UnauthorizedError,
} from "@onerlaw/framework/backend/rpc";
import { procedure } from "../../router.mjs";
import { z } from "zod";

const RespondSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  message: z.string().min(1, "Message is required"),
});

export const respond = procedure
  .input(RespondSchema)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.auth.user) {
      throw new UnauthorizedError();
    }

    const { conversationId, message } = input;

    const response = await ctx.service.agent.respond(
      ctx,
      ctx.auth.user.id,
      conversationId,
      message,
    );

    if (response === null) {
      throw new InternalServerError(
        "Failed to generate response from AI agent",
      );
    }

    return {
      response,
    };
  });
